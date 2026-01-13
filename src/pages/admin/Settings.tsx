import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Settings</h1>
        <p className="text-muted-foreground">Configure brand settings, roles, and security</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Brand Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Brand Name</Label><Input defaultValue="RIMAE" /></div>
            <div className="space-y-2"><Label>Tagline</Label><Input defaultValue="Make Your Own Perfume" /></div>
            <div className="space-y-2"><Label>Currency</Label>
              <Select defaultValue="inr"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="inr">INR (₹)</SelectItem><SelectItem value="usd">USD ($)</SelectItem></SelectContent></Select>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
            <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
            <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" /></div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
