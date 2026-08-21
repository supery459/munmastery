import { z } from "zod";
import { GEMINI_MODEL, MissingApiKeyError, getGeminiClient } from "@/lib/gemini";
import {
  analyzePacingFromDuration,
  analyzePacingFromText,
  deriveDiagnostic,
  words,
} from "@/components/speech-analysis/analysis";
import type { AnalyzeContext, DimensionResult, SpeechDimension } from "@/components/speech-analysis/types";

export const runtime = "nodejs";

type DiagnosticRequestBody = {
  text: string;
  durationSeconds: number | null;
  context?: AnalyzeContext;
};

function isDiagnosticRequestBody(value: unknown): value is DiagnosticRequestBody {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.text === "string" && (v.durationSeconds === null || typeof v.durationSeconds === "number");
}

const DimensionSchema = z.object({
  score: z.number().int().min(0).max(100),
  notes: z.array(z.string()).min(1).max(2),
  highlights: z.array(z.string()).max(4),
});

const DiagnosticDimensionsSchema = z.object({
  confidence: DimensionSchema,
  diplomaticTone: DimensionSchema,
  evidenceDensity: DimensionSchema,
  structure: DimensionSchema,
});

/** Gemini's response_format.schema wants a plain JSON Schema object, no $schema meta key. */
function toGeminiSchema(schema: z.ZodType): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(schema) as Record<string, unknown>;
  delete jsonSchema.$schema;
  return jsonSchema;
}

function buildSystemPrompt(): string {
  return [
    "You are a Model United Nations speech coach giving a delegate instant, honest diagnostic feedback on a speech transcript.",
    "Score exactly four dimensions on a 0-100 scale, based only on the transcript provided:",
    "- confidence: assured vs. hedging delivery — penalize hedge phrases (\"I think\", \"maybe\", \"sort of\") and filler words, reward assertive, declarative language.",
    "- diplomaticTone: respectful, formal diplomatic register vs. undiplomatic or hostile language; penalize insults, shouting, or excessive exclamation.",
    "- evidenceDensity: concrete data, named institutions, cited instruments/treaties, or sourcing phrases vs. bare assertion.",
    "- structure: clear signposting (first/therefore/in conclusion), a discernible opening and closing, reasonable sentence length and pacing of ideas.",
    "For each dimension return a 0-100 integer score, 1-2 short constructive notes (each under 25 words, specific and honest — do not inflate scores for short or weak speeches), and up to 4 short highlight strings quoting exact words or phrases from the transcript that drove the score (e.g. an actual hedge phrase used, an actual data point cited). If the transcript is empty or near-empty, score all dimensions low and say so plainly.",
    "If a delegation, committee, or topic is given, judge diplomaticTone and evidenceDensity partly against how well the speech reads as that delegation's real position on that specific topic — but never penalize for omitting context the delegate didn't provide.",
    "Respond with ONLY a JSON object matching the required schema — no prose, no markdown fences.",
  ].join(" ");
}

function buildContextLine(context: AnalyzeContext | undefined): string {
  if (!context) return "";
  const parts = [
    context.country ? `Delegation: ${context.country}` : null,
    context.committee ? `Committee: ${context.committee}` : null,
    context.topic ? `Topic: ${context.topic}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? `${parts.join("\n")}\n\n` : "";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isDiagnosticRequestBody(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  let client;
  try {
    client = getGeminiClient();
  } catch (err) {
    const status = err instanceof MissingApiKeyError ? 503 : 500;
    return Response.json({ error: err instanceof Error ? err.message : "AI service unavailable" }, { status });
  }

  const wordCount = words(body.text).length;
  const hasDuration = body.durationSeconds !== null && body.durationSeconds >= 8;
  const pacing: DimensionResult = hasDuration
    ? analyzePacingFromDuration(wordCount, body.durationSeconds as number)
    : analyzePacingFromText(body.text);

  try {
    const interaction = await client.interactions.create({
      model: GEMINI_MODEL,
      input: `${buildContextLine(body.context)}Speech transcript (${wordCount} words):\n"${body.text.trim().length > 0 ? body.text.trim() : "(empty — no speech was provided)"}"`,
      system_instruction: buildSystemPrompt(),
      generation_config: { max_output_tokens: 2000, thinking_level: "low" },
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: toGeminiSchema(DiagnosticDimensionsSchema),
      },
    });

    if (!interaction.output_text) {
      return Response.json({ error: "The model did not return a parseable diagnostic" }, { status: 502 });
    }

    const parsed = DiagnosticDimensionsSchema.safeParse(JSON.parse(interaction.output_text));
    if (!parsed.success) {
      return Response.json({ error: "The model returned an invalid diagnostic shape" }, { status: 502 });
    }

    const dimensions: Record<SpeechDimension, DimensionResult> = { ...parsed.data, pacing };

    return Response.json(
      deriveDiagnostic(
        dimensions,
        wordCount,
        hasDuration ? "recorded" : wordCount > 0 ? "estimated" : "unmeasured",
        hasDuration ? Math.round(wordCount / ((body.durationSeconds as number) / 60)) : null,
      ),
    );
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Speech analysis failed" },
      { status: 502 },
    );
  }
}
