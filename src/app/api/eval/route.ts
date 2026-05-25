import { jsonResponse } from "../_utils";
import { runEvalSuite } from "@/lib/build-doctor";
import { evalResultsSchema } from "@/lib/schemas";

export async function GET() {
  const evals = evalResultsSchema.parse(runEvalSuite());
  return jsonResponse({ ok: true, data: evals, ...evals });
}

export async function POST() {
  const evals = evalResultsSchema.parse(runEvalSuite());
  return jsonResponse({ ok: true, data: evals, ...evals });
}
