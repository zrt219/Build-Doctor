import { jsonResponse, readJsonBody, safeErrorResponse } from "../_utils";
import { diagnoseBuildLog } from "@/lib/build-doctor";
import { diagnoseRequestSchema, diagnosisSchema, maxBuildLogInputChars } from "@/lib/schemas";

export async function POST(request: Request) {
  const bodyResult = await readJsonBody(request, maxBuildLogInputChars + 20_000);
  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  const parsed = diagnoseRequestSchema.safeParse(bodyResult.body);

  if (!parsed.success) {
    return safeErrorResponse(
      "INVALID_BUILD_LOG",
      "Request body failed validation. Redact secrets and keep pasted logs limited to the relevant failing section.",
      400,
      parsed.error.issues,
    );
  }

  const diagnosis = diagnosisSchema.parse(diagnoseBuildLog(parsed.data.log));
  return jsonResponse({ ok: true, data: { diagnosis, mode: "deterministic", rawLogStored: false }, diagnosis, mode: "deterministic", rawLogStored: false });
}
