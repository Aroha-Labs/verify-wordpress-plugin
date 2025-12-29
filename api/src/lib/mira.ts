export interface MiraVerifyRequest {
  fact: string;
  domain?: "general" | "legal";
  minRequired?: 2 | 3;
  totalModels?: number;
}

export interface MiraClaimResult {
  id: string;
  claim: string;
  assessment: "TRUE" | "FALSE" | "NO CONSENSUS";
  original_question: string;
  original_options: Record<string, string>;
  claimed_answer: string;
  model_answers: Array<{ model: string; answer: string }>;
  consensus_answer: string;
}

export interface MiraVerifyResponse {
  requestId: string;
  original_fact: string;
  results: MiraClaimResult[];
  timestamp: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  minRequired: number;
}

const MIRA_API_URL = "https://console.miranet.work/verify/v1/stream";

export async function verifyWithMira(
  apiKey: string,
  request: MiraVerifyRequest
): Promise<Response> {
  const response = await fetch(MIRA_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return response;
}
