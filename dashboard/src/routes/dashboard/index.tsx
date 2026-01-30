import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSubscription, getSites, getVerificationHistory } from "@/lib/api";
import { Globe, CheckCircle, TrendingUp } from "lucide-react";

export function DashboardPage() {
  const { data: subscriptionData } = useQuery({
    queryKey: ["subscription"],
    queryFn: getCurrentSubscription,
  });

  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
  });

  const { data: history } = useQuery({
    queryKey: ["history"],
    queryFn: () => getVerificationHistory(10),
  });

  const subscription = subscriptionData?.subscription;
  const plan = subscriptionData?.plan;

  const usagePercent = plan?.monthlyLimit
    ? Math.round((subscription?.verificationsUsed || 0) / plan.monthlyLimit * 100)
    : 0;

  const getContentDisplay = (record: { postTitle: string | null; contentPreview: string | null }) => {
    if (record.postTitle) {
      return record.postTitle;
    }
    if (record.contentPreview) {
      const preview = record.contentPreview.length >= 100
        ? record.contentPreview + "..."
        : record.contentPreview;
      return preview.length > 50 ? preview.slice(0, 50) + "..." : preview;
    }
    return <span className="text-red-500">No content</span>;
  };

  return (
    <div>
      <title>Dashboard - FactPress</title>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome to your FactPress dashboard
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verifications Used</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription?.verificationsUsed || 0}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {plan?.monthlyLimit || 0}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connected Sites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {plan?.siteLimit === -1 ? "Unlimited" : `${plan?.siteLimit || 0} max`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan?.name || "No Plan"}</div>
            <p className="text-xs text-muted-foreground">
              {subscription?.status === "active" ? "Active" : subscription?.status || "Inactive"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Verifications */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
          <CardDescription>Your latest content verifications</CardDescription>
        </CardHeader>
        <CardContent>
          {history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((record) => (
                <Link
                  key={record.id}
                  to="/dashboard/verification/$id"
                  params={{ id: record.id }}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-md transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{getContentDisplay(record)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      record.status === "TRUE"
                        ? "bg-green-100 text-green-800"
                        : record.status === "FALSE"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.status ?? <span className="text-red-500">ERROR</span>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No verifications yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
