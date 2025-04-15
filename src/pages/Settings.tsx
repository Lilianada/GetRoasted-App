
import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Trash2,
  Mail,
  MessageSquare,
  User,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleSaveSettings = () => {
    toast.success("Settings saved", {
      description: "Your preferences have been updated",
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === "DELETE") {
      toast.error("Account scheduled for deletion", {
        description: "Sorry to see you go. Your account will be deleted in 30 days.",
      });
    } else {
      toast.error("Confirmation text doesn't match");
    }
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />

      <main className="container flex-1 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-flame-500" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <div className="grid gap-6">
            <Card className="flame-card border-night-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    defaultValue="FlameThrow3r"
                    className="border-night-700 focus-visible:ring-flame-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how you'll appear in battles and on the leaderboard.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue="flame@getroasted.com"
                    type="email"
                    className="border-night-700 focus-visible:ring-flame-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue="Professional roaster with a knack for creative insults and quick comebacks. Always ready for a verbal duel!"
                    className="border-night-700 focus-visible:ring-flame-500 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tell others about your roasting style in 160 characters or less.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-night-700 pt-6">
                <Button 
                  className="bg-gradient-flame hover:opacity-90"
                  onClick={handleSaveSettings}
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card className="flame-card border-night-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about battles and mentions
                    </p>
                  </div>
                  <Switch 
                    checked={notificationsEnabled} 
                    onCheckedChange={setNotificationsEnabled} 
                    className="data-[state=checked]:bg-flame-500"
                  />
                </div>

                <Separator className="bg-night-700" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-base">Email Notifications</Label>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                      disabled={!notificationsEnabled}
                      className="data-[state=checked]:bg-flame-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-base">In-App Notifications</Label>
                    </div>
                    <Switch 
                      checked={inAppNotifications} 
                      onCheckedChange={setInAppNotifications}
                      disabled={!notificationsEnabled}
                      className="data-[state=checked]:bg-flame-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flame-card border-night-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between dark and light theme
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                    className="data-[state=checked]:bg-flame-500"
                  />
                </div>
                
                <Separator className="bg-night-700" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds during battles
                    </p>
                  </div>
                  <Switch 
                    checked={soundEffects} 
                    onCheckedChange={setSoundEffects} 
                    className="data-[state=checked]:bg-flame-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-night-700 pt-6">
                <Button 
                  className="bg-gradient-flame hover:opacity-90"
                  onClick={handleSaveSettings}
                >
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-night-800 border-destructive/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-night-800 border-night-700">
                    <DialogHeader>
                      <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <p className="text-sm text-muted-foreground">
                        To confirm, type <span className="font-bold text-destructive">DELETE</span> in the field below:
                      </p>
                      <Input
                        className="border-night-700"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== "DELETE"}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
