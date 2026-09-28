import { GEMINI_MODEL, GEMINI_FALLBACK_MODEL, MissingApiKeyError, getGeminiClient, isTransientModelError } from "@/lib/gemini";
import { ThinkingLevel } from "@google/genai";

export const runtime = "nodejs";

type DelegateMode = "opening" | "caucus" | "point";

type DelegateRequestBody = {
  mode: DelegateMode;
  committee: { name: string };
  topic: { title: string; brief: string; keyIssues: string[] };
  country: { name: string; formalName: string; bloc: string; priorities: string[] };
  targetCountryName?: string;
};

function isDelegateRequestBody(value: unknown): value is DelegateRequestBody {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    (v.mode === "opening" || v.mode === "caucus" || v.mode === "point") &&
    typeof v.committee === "object" &&
    typeof v.topic === "object" &&
    typeof v.country === "object"
  );
}

const MAX_TOKENS: Record<DelegateMode, number> = {
  opening: 500,
  caucus: 300,
  point: 150,
};

const LENGTH_GUIDANCE: Record<DelegateMode, string> = {
  opening: "Deliver a formal opening statement of roughly 110-160 words.",
  caucus: "Deliver a tighter moderated-caucus remark of roughly 50-80 words — punchier than an opening statement.",
  point:
    "Raise a single, pointed point of inquiry (one or two sentences, under 40 words) directed at the delegate whose speech is described below. It should press on a real gap or tension in their position.",
};

function buildSystemPrompt(body: DelegateRequestBody): string {
  return [
    "You are role-playing as an AI delegate inside a Model United Nations committee simulation used for practice.",
    `You represent ${body.country.formalName} (bloc: ${body.country.bloc}) in the ${body.committee.name}.`,
    `Your delegation's real-world foreign-policy priorities include: ${body.country.priorities.join(", ")}.`,
    `Ground every position in this country's genuine, real-world foreign policy doctrine and diplomatic style — do not invent specific real-world events, statistics, or named officials; reason from general, well-established policy stances instead.`,
    "Speak in a formal, diplomatic Model UN register, in the third person where natural (e.g. \"The delegation of France believes...\").",
    "Output ONLY the spoken remarks — no stage directions, no speaker labels, no markdown, no quotation marks wrapping the text, no meta-commentary about being an AI.",
    LENGTH_GUIDANCE[body.mode],
  ].join(" ");
}

function buildUserPrompt(body: DelegateRequestBody): string {
  const lines = [
    `Committee: ${body.committee.name}`,
    `Topic under debate: ${body.topic.title}`,
    `Topic brief: ${body.topic.brief}`,
    `Key sub-issues on the floor: ${body.topic.keyIssues.join(", ")}`,
  ];
  if (body.mode === "point" && body.targetCountryName) {
    lines.push(
      `The delegate of ${body.targetCountryName} just spoke. Raise your point of inquiry directed at that delegate now.`,
    );
  } else {
    lines.push(`Deliver your ${body.mode === "opening" ? "opening statement" : "caucus remarks"} now.`);
  }
  return lines.join("\n");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!isDelegateRequestBody(body)) {
    return new Response("Missing required fields", { status: 400 });
  }

  let client;
  try {
    client = getGeminiClient();
  } catch (err) {
    const status = err instanceof MissingApiKeyError ? 503 : 500;
    return new Response(err instanceof Error ? err.message : "AI service unavailable", { status });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let emitted = false;
        for (const model of [GEMINI_MODEL, GEMINI_FALLBACK_MODEL]) {
          try {
        const geminiStream = await client.models.generateContentStream({
          model,
          contents: buildUserPrompt(body),
          config: {
            systemInstruction: buildSystemPrompt(body),
            maxOutputTokens: MAX_TOKENS[body.mode] + 1000,
            thinkingConfig: model === GEMINI_MODEL ? { thinkingLevel: ThinkingLevel.LOW } : undefined,
            abortSignal: req.signal,
          },
        });

        for await (const event of geminiStream) {
          if (event.text) { emitted = true; controller.enqueue(encoder.encode(event.text)); }
        }
        break;
          } catch (error) {
            if (model === GEMINI_FALLBACK_MODEL || emitted || !isTransientModelError(error)) throw error;
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
