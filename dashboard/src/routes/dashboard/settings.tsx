import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div>
      <title>Settings - Mira Verify</title>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your account settings
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={session?.user?.name || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={session?.user?.email || ""} disabled />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>WordPress Plugin</CardTitle>
          <CardDescription>Download and install the plugin</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Download the Mira Verify WordPress plugin to connect your sites and start
            verifying content.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Plugin download will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
