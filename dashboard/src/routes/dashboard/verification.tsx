import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getVerification } from "@/lib/api";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, HelpCircle } from "lucide-react";

const getStatusInfo = (status: string | null) => {
  switch (status) {
    case "TRUE":
      return {
        label: "Verified True",
        icon: CheckCircle,
        className: "text-green-600",
        bgClassName: "bg-green-50 border-green-200",
      };
    case "FALSE":
      return {
        label: "Verified False",
        icon: XCircle,
        className: "text-red-600",
        bgClassName: "bg-red-50 border-red-200",
      };
    case "NO_CONSENSUS":
    case "NO CONSENSUS":
      return {
        label: "No Consensus",
        icon: HelpCircle,
        className: "text-yellow-600",
        bgClassName: "bg-yellow-50 border-yellow-200",
      };
    case "MIXED":
      return {
        label: "Mixed Results",
        icon: AlertCircle,
        className: "text-orange-600",
        bgClassName: "bg-orange-50 border-orange-200",
      };
    default:
      return {
        label: status || "Unknown",
        icon: AlertCircle,
        className: "text-red-600",
        bgClassName: "bg-red-50 border-red-200",
      };
  }
};

const getClaimBadge = (assessment: string) => {
  switch (assessment) {
    case "TRUE":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shrink-0">True</Badge>;
    case "FALSE":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 shrink-0">False</Badge>;
    case "NO_CONSENSUS":
    case "NO CONSENSUS":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 shrink-0">No Consensus</Badge>;
    default:
      return <Badge variant="secondary" className="shrink-0">{assessment}</Badge>;
  }
};

interface ClaimResult {
  claim: string;
  assessment: string;
  model_answers?: Array<{ model: string; answer: string }>;
}

interface MiraResult {
  results: ClaimResult[];
}

export function VerificationDetailPage() {
  const { id } = useParams({ strict: false });

  const { data: detail, isLoading, error } = useQuery({
    queryKey: ["verification", id],
    queryFn: () => getVerification(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div>
        <Link to="/dashboard/usage">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </Link>
        <p className="mt-4 text-red-500">
          {error instanceof Error ? error.message : "Verification not found"}
        </p>
      </div>
    );
  }

  let parsedResult: MiraResult | null = null;
  if (detail.result) {
    try {
      parsedResult = JSON.parse(detail.result);
    } catch {
      // Invalid JSON
    }
  }

  const statusInfo = getStatusInfo(detail.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div>
      <title>Verification Details - Mira Verify</title>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/dashboard/usage">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </Link>
        <span className="text-sm text-muted-foreground">
          {format(new Date(detail.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </span>
      </div>

      {/* Status Banner */}
      <Card className={`mb-6 border ${statusInfo.bgClassName}`}>
        <CardContent>
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-8 w-8 ${statusInfo.className}`} />
            <div>
              <h1 className="text-xl font-semibold">
                {detail.postTitle || "Verification Result"}
              </h1>
              <p className={`text-sm font-medium ${statusInfo.className}`}>
                {statusInfo.label}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Content */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Original Content
          </h2>
          <Card>
            <CardContent>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {detail.content || <span className="text-red-500">No content</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Claims */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Claims Analyzed ({parsedResult?.results?.length || 0})
          </h2>
          <div className="space-y-3">
            {parsedResult?.results && parsedResult.results.length > 0 ? (
              parsedResult.results.map((claim, index) => (
                <Card key={index}>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm flex-1">{claim.claim}</p>
                          {getClaimBadge(claim.assessment)}
                        </div>
                        {claim.model_answers && claim.model_answers.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex flex-wrap gap-2">
                              {claim.model_answers.map((m, i) => {
                                const modelName = m.model.split("/").pop() || m.model;
                                const isTrue = m.answer === "A";
                                return (
                                  <span
                                    key={i}
                                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                      isTrue
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {isTrue ? (
                                      <CheckCircle className="h-3 w-3" />
                                    ) : (
                                      <XCircle className="h-3 w-3" />
                                    )}
                                    {modelName}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No claims were extracted from this content.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
