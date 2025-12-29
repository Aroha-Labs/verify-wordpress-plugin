import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface ClaimResult {
  claim: string;
  assessment: string;
  models?: Array<{ model: string; response: string }>;
}

interface VerificationProgress {
  type: string;
  message: string;
  claimsCount?: number;
  currentClaim?: string;
}

export function PlaygroundPage() {
  const [content, setContent] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState<VerificationProgress | null>(null);
  const [results, setResults] = useState<ClaimResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!content.trim()) return;

    setIsVerifying(true);
    setError(null);
    setResults([]);
    setProgress({ type: "starting", message: "Starting verification..." });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Verification failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              handleSSEEvent(data);
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsVerifying(false);
      setProgress(null);
    }
  };

  const handleSSEEvent = (event: any) => {
    switch (event.type) {
      case "starting":
        setProgress({ type: "starting", message: event.message || "Starting verification..." });
        break;
      case "extracting_claims":
        setProgress({ type: "extracting", message: event.message || "Extracting claims from content..." });
        break;
      case "claims_extracted":
        setProgress({
          type: "extracted",
          message: event.message || `Found ${event.data?.questionCount || 0} claims to verify`,
          claimsCount: event.data?.questionCount,
        });
        break;
      case "verifying_claims":
        setProgress({ type: "verifying", message: event.message || "Verifying claims with AI models..." });
        break;
      case "verifying_claim":
        setProgress({
          type: "verifying_claim",
          message: event.message || "Verifying claim...",
          currentClaim: event.data?.claim,
        });
        break;
      case "claim_verified":
        setResults((prev) => [
          ...prev,
          {
            claim: event.data?.claim,
            assessment: event.data?.assessment,
            models: event.data?.model_answers?.map((m: any) => ({ model: m.model, response: m.answer })),
          },
        ]);
        break;
      case "completed":
        // Set final results from completed event if we missed any
        if (event.data?.results) {
          setResults(event.data.results.map((r: any) => ({
            claim: r.claim,
            assessment: r.assessment,
            models: r.model_answers?.map((m: any) => ({ model: m.model, response: m.answer })),
          })));
        }
        setProgress(null);
        break;
      case "error":
        setError(event.message || "An error occurred");
        break;
    }
  };

  const getAssessmentBadge = (assessment: string) => {
    switch (assessment) {
      case "TRUE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified True</Badge>;
      case "FALSE":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Verified False</Badge>;
      case "NO_CONSENSUS":
      case "NO CONSENSUS":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">No Consensus</Badge>;
      default:
        return <Badge variant="secondary">{assessment}</Badge>;
    }
  };

  return (
    <div>
      <title>Playground - Mira Verify</title>
      <h1 className="text-3xl font-bold">Playground</h1>
      <p className="mt-2 text-muted-foreground">
        Test content verification manually
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Verify Content</CardTitle>
          <CardDescription>
            Enter text content to verify using multi-model AI consensus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full min-h-[200px] p-3 border rounded-md bg-background resize-y"
            placeholder="Enter the content you want to verify..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isVerifying}
          />
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !content.trim()}
          >
            {isVerifying ? "Verifying..." : "Verify Content"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mt-4 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {progress && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>{progress.message}</span>
            </div>
            {progress.currentClaim && (
              <p className="mt-2 text-sm text-muted-foreground italic">
                "{progress.currentClaim}"
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {results.length} claim{results.length !== 1 ? "s" : ""} verified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="flex-1">{result.claim}</p>
                  {getAssessmentBadge(result.assessment)}
                </div>
                {result.models && result.models.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Model Responses:</p>
                    <div className="space-y-1">
                      {result.models.map((model, i) => {
                        const modelName = model.model.split("/").pop() || model.model;
                        const response = model.response === "A" ? "True" : model.response === "B" ? "False" : model.response;
                        return (
                          <p key={i} className="text-sm">
                            <span className="font-medium">{modelName}:</span>{" "}
                            <span className="text-muted-foreground">{response}</span>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
