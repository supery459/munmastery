import { z } from "zod";
import { GEMINI_MODEL, MissingApiKeyError, getGeminiClient } from "@/lib/gemini";
import { deriveReview, words } from "@/components/position-paper/analysis";
import type { CriterionResult, PositionPaperCriterion } from "@/components/position-paper/types";

export const runtime = "nodejs";

type GradeRequestBody = {
  text: string;
  country: string;
  topic: string;
};

function isGradeRequestBody(value: unknown): value is GradeRequestBody {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.text === "string" && typeof v.country === "string" && typeof v.topic === "string";
}

const CriterionSchema = z.object({
  score: z.number().int().min(0).max(100),
  notes: z.array(z.string()).min(1).max(2),
  highlights: z.array(z.string()).max(4),
});

const ReviewSchema = z.object({
  policyAlignment: CriterionSchema,
  topicAnalysis: CriterionSchema,
  proposedSolutions: CriterionSchema,
  formatting: CriterionSchema,
  summary: z.string().min(1).max(600),
});

/** Gemini's response_format.schema wants a plain JSON Schema object, no $schema meta key. */
function toGeminiSchema(schema: z.ZodType): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(schema) as Record<string, unknown>;
  delete jsonSchema.$schema;
  return jsonSchema;
}

function buildSystemPrompt(): string {
  return [
    "You are a Model United Nations chair grading a delegate's draft position paper.",
    "Score exactly four criteria on a 0-100 scale, based only on the draft provided:",
    "- policyAlignment: how coherently the paper reflects a realistic, internally consistent foreign-policy stance for the stated delegation (or a plausible national-interest stance if no country is given), free of contradictions or generic non-committal language.",
    "- topicAnalysis: depth of understanding of the topic's background, root causes, key stakeholders, and relevant prior international action (treaties, resolutions, precedent).",
    "- proposedSolutions: how concrete, actionable, and feasible the proposed measures are — specific mechanisms and calls to action beat vague aspirations.",
    "- formatting: clear structure following position-paper conventions (readable sections such as background/policy/solutions, reasonable length, grammar, professional tone).",
    "For each criterion return a 0-100 integer score, 1-2 short constructive notes (each under 30 words, specific and honest — do not inflate scores for thin or weak drafts), and up to 4 short highlight strings quoting exact words or phrases from the draft that drove the score.",
    "Also return a top-level `summary`: 2-3 sentences of actionable, specific improvement suggestions a delegate could act on immediately, referencing the weakest criteria.",
    "If the draft is empty or near-empty, score all criteria low and say so plainly in the summary.",
    "Respond with ONLY a JSON object matching the required schema — no prose, no markdown fences.",
  ].join(" ");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isGradeRequestBody(body)) {
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
  const context = [
    body.country.trim() ? `Delegation: ${body.country.trim()}` : null,
    body.topic.trim() ? `Committee topic: ${body.topic.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const interaction = await client.interactions.create({
      model: GEMINI_MODEL,
      input: `${context ? `${context}\n\n` : ""}Position paper draft (${wordCount} words):\n"${body.text.trim().length > 0 ? body.text.trim() : "(empty — no draft was provided)"}"`,
      system_instruction: buildSystemPrompt(),
      generation_config: { max_output_tokens: 2400, thinking_level: "low" },
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: toGeminiSchema(ReviewSchema),
      },
    });

    if (!interaction.output_text) {
      return Response.json({ error: "The model did not return a parseable review" }, { status: 502 });
    }

    const parsed = ReviewSchema.safeParse(JSON.parse(interaction.output_text));
    if (!parsed.success) {
      return Response.json({ error: "The model returned an invalid review shape" }, { status: 502 });
    }

    const { summary, ...criteriaData } = parsed.data;
    const criteria = criteriaData as Record<PositionPaperCriterion, CriterionResult>;

    return Response.json(deriveReview(criteria, wordCount, summary));
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Position paper review failed" },
      { status: 502 },
    );
  }
}
