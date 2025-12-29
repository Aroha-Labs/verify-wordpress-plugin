import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSites, deleteSite, updateSite, type Site } from "@/lib/api";
import { Globe, Trash2, ExternalLink } from "lucide-react";

export function SitesPage() {
  const queryClient = useQueryClient();

  const { data: sites, isLoading } = useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });

  const toggleBadgeMutation = useMutation({
    mutationFn: ({ id, showBadge }: { id: string; showBadge: boolean }) =>
      updateSite(id, { showBadge }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });

  const handleDelete = (site: Site) => {
    if (confirm(`Disconnect ${site.domain}?`)) {
      deleteMutation.mutate(site.id);
    }
  };

  return (
    <div>
      <title>Sites - Mira Verify</title>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Connected Sites</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your WordPress sites connected to Mira Verify
          </p>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Sites</CardTitle>
          <CardDescription>
            Connect new sites using the WordPress plugin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : sites && sites.length > 0 ? (
            <div className="space-y-4">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{site.name || site.domain}</p>
                      <p className="text-sm text-muted-foreground">{site.domain}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleBadgeMutation.mutate({
                          id: site.id,
                          showBadge: !site.showBadge,
                        })
                      }
                    >
                      {site.showBadge ? (
                        <Badge variant="default">Badge On</Badge>
                      ) : (
                        <Badge variant="secondary">Badge Off</Badge>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(`https://${site.domain}`, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(site)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No sites connected</h3>
              <p className="mt-2 text-muted-foreground">
                Install the Mira Verify plugin on your WordPress site and connect it here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Connect a Site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              1
            </div>
            <div>
              <p className="font-medium">Install the Plugin</p>
              <p className="text-sm text-muted-foreground">
                Download and install the Mira Verify plugin on your WordPress site
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              2
            </div>
            <div>
              <p className="font-medium">Connect Your Account</p>
              <p className="text-sm text-muted-foreground">
                Go to Settings → Mira Verify and click "Connect to Mira Verify"
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              3
            </div>
            <div>
              <p className="font-medium">Start Verifying</p>
              <p className="text-sm text-muted-foreground">
                Use the "Verify Content" button in your WordPress editor
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
