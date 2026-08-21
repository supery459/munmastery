import { z } from "zod";
import { GEMINI_MODEL, MissingApiKeyError, getGeminiClient } from "@/lib/gemini";
import { deriveScoreResult } from "@/components/simulator/scoring";
import type { ScoreContext } from "@/components/simulator/types";

export const runtime = "nodejs";

type SpeechInput = {
  role: "opening" | "caucus" | "point";
  text: string;
  timeLimit: number;
  timedOut: boolean;
};

type ScorecardRequestBody = {
  committee: { name: string; shortName: string };
  topic: { title: string; keyIssues: string[] };
  country: { code: string; name: string; formalName: string };
  speeches: SpeechInput[];
};

function isScorecardRequestBody(value: unknown): value is ScorecardRequestBody {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.committee === "object" &&
    typeof v.topic === "object" &&
    typeof v.country === "object" &&
    Array.isArray(v.speeches)
  );
}

const DimensionSchema = z.object({
  score: z.number().int().min(0).max(100),
  notes: z.array(z.string()).min(1).max(2),
});

const ScorecardDimensionsSchema = z.object({
  clarity: DimensionSchema,
  diplomaticStrategy: DimensionSchema,
  researchDepth: DimensionSchema,
  persuasiveness: DimensionSchema,
});

/** Gemini's response_format.schema wants a plain JSON Schema object, no $schema meta key. */
function toGeminiSchema(schema: z.ZodType): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(schema) as Record<string, unknown>;
  delete jsonSchema.$schema;
  return jsonSchema;
}

function buildSystemPrompt(): string {
  return [
    "You are an experienced Model United Nations committee chair grading a delegate's performance for a post-session executive debrief.",
    "Score exactly four dimensions on a 0-100 scale, based only on the delegate's actual speech transcripts provided:",
    "- clarity: how clear, well-paced, and easy to follow the delivery was (penalize filler words, rambling, or speeches far too short for the time given).",
    "- diplomaticStrategy: coalition awareness, engaging other delegations/blocs, proposing concrete mechanisms rather than only stating a position.",
    "- researchDepth: how specifically the delegate engaged the topic's actual sub-issues, cited concrete instruments/data rather than vague assertion.",
    "- persuasiveness: rhetorical strength, calls to action, confidence of argument.",
    "For each dimension return a 0-100 integer score and 1-2 short, specific, constructive notes (each under 25 words) that quote or reference something concrete the delegate actually said. Be honest and specific — do not default to the same score for every dimension, and do not inflate scores for very short or empty speeches.",
    "Respond with ONLY a JSON object matching the required schema — no prose, no markdown fences.",
  ].join(" ");
}

function buildUserPrompt(body: ScorecardRequestBody): string {
  const speechesText = body.speeches
    .map(
      (s, i) =>
        `Speech ${i + 1} (${s.role}, ${s.timeLimit}s allotted${s.timedOut ? ", cut off by the chair before finishing" : ""}):\n"${
          s.text.trim().length > 0 ? s.text.trim() : "(no remarks delivered)"
        }"`,
    )
    .join("\n\n");

  return [
    `Committee: ${body.committee.name}`,
    `Topic: ${body.topic.title}`,
    `Topic sub-issues: ${body.topic.keyIssues.join(", ")}`,
    `Delegate: ${body.country.formalName} (${body.country.name})`,
    "",
    "Transcripts to grade:",
    speechesText,
  ].join("\n");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isScorecardRequestBody(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  let client;
  try {
    client = getGeminiClient();
  } catch (err) {
    const status = err instanceof MissingApiKeyError ? 503 : 500;
    return Response.json({ error: err instanceof Error ? err.message : "AI service unavailable" }, { status });
  }

  try {
    const interaction = await client.interactions.create({
      model: GEMINI_MODEL,
      input: buildUserPrompt(body),
      system_instruction: buildSystemPrompt(),
      generation_config: { max_output_tokens: 2000, thinking_level: "low" },
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: toGeminiSchema(ScorecardDimensionsSchema),
      },
    });

    if (!interaction.output_text) {
      return Response.json({ error: "The model did not return a parseable scorecard" }, { status: 502 });
    }

    const parsed = ScorecardDimensionsSchema.safeParse(JSON.parse(interaction.output_text));
    if (!parsed.success) {
      return Response.json({ error: "The model returned an invalid scorecard shape" }, { status: 502 });
    }

    const context: ScoreContext = {
      committee: body.committee,
      topic: body.topic,
      country: body.country,
    };

    return Response.json(deriveScoreResult(parsed.data, context));
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Scorecard generation failed" },
      { status: 502 },
    );
  }
}
