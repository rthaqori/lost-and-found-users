// pages/ProfilePage.tsx
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Building2,
  CalendarDays,
  Shield,
  ChevronRight,
  Settings,
  Edit,
  LogOut,
  Bell,
  Lock,
  Eye,
  MessageSquare,
  ThumbsUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ChangePasswordDialog } from "../dialogs/changePasswordDialog";

export function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6 text-center">
          <CardTitle>Not Logged In</CardTitle>
          <CardDescription>Please login to view your profile</CardDescription>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "college_admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  // Format date
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="from-primary/80 to-primary h-32 bg-gradient-to-r" />
          <CardContent className="relative px-6 pb-6">
            <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <Avatar className="border-background h-24 w-24 border-4 shadow-xl">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="mt-2 flex-1 space-y-2 sm:mt-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {formatRole(user.role)}
                  </Badge>
                  {!user.isEmailVerified && (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              <div className="flex gap-2 self-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/edit-profile")}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <ChangePasswordDialog />
                <Button variant="destructive" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Personal Information */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow
                    icon={<User className="h-4 w-4" />}
                    label="Full Name"
                    value={user.name}
                  />
                  <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={user.email}
                    badge={
                      user.isEmailVerified ? (
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-700"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-yellow-200 bg-yellow-50 text-yellow-700"
                        >
                          Pending
                        </Badge>
                      )
                    }
                  />
                  <InfoRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="College"
                    value={user.college?.name || "Not assigned"}
                    subValue={user.college?.shortName}
                  />
                  <InfoRow
                    icon={<Shield className="h-4 w-4" />}
                    label="Role"
                    value={formatRole(user.role)}
                  />
                  <InfoRow
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Member since"
                    value={
                      user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"
                    }
                  />
                  <InfoRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Last active"
                    value={formatDate(user.lastActive)}
                  />
                </CardContent>
              </Card>

              {/* College Information */}
              {user.college && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5" />
                      College Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <InfoRow
                      icon={<Building2 className="h-4 w-4" />}
                      label="College Name"
                      value={user.college.name}
                    />
                    <InfoRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Domain"
                      value={user.college.domain}
                    />
                    {user.college.logo && (
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground w-24 text-sm">
                          College Logo
                        </span>
                        <img
                          src={user.college.logo}
                          alt={user.college.name}
                          className="h-12 w-12 rounded-lg border object-contain"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Privacy Settings Summary */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow
                    icon={<MessageSquare className="h-4 w-4" />}
                    label="Messages from"
                    value={
                      user.chatPrivacy?.allowMessagesFrom
                        ? user.chatPrivacy.allowMessagesFrom
                            .split("_")
                            .join(" ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())
                        : "Everyone"
                    }
                  />
                  <InfoRow
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Read receipts"
                    value={
                      user.chatPrivacy?.showReadReceipts
                        ? "Enabled"
                        : "Disabled"
                    }
                  />
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.notificationPreferences && (
                    <>
                      <InfoRow
                        icon={<Mail className="h-4 w-4" />}
                        label="Email notifications"
                        value={
                          user.notificationPreferences.email
                            ? "Enabled"
                            : "Disabled"
                        }
                      />
                      <InfoRow
                        icon={<Bell className="h-4 w-4" />}
                        label="Push notifications"
                        value={
                          user.notificationPreferences.push
                            ? "Enabled"
                            : "Disabled"
                        }
                      />
                      <InfoRow
                        icon={<ThumbsUp className="h-4 w-4" />}
                        label="Match notifications"
                        value={
                          user.notificationPreferences.matches
                            ? "Enabled"
                            : "Disabled"
                        }
                      />
                      <InfoRow
                        icon={<MessageSquare className="h-4 w-4" />}
                        label="Message notifications"
                        value={
                          user.notificationPreferences.messages
                            ? "Enabled"
                            : "Disabled"
                        }
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground py-8 text-center">
                  <Clock className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>No recent activity to display</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => navigate("/settings/profile")}
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile Settings
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Separator />
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => navigate("/settings/privacy")}
                >
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Privacy & Security
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Separator />
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => navigate("/settings/notifications")}
                >
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notification Preferences
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Separator />
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => navigate("/settings/security")}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper component for info rows
function InfoRow({ icon, label, value, subValue, badge }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-muted-foreground text-sm">{label}</p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{value}</p>
          {subValue && (
            <p className="text-muted-foreground text-sm">({subValue})</p>
          )}
          {badge}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="from-primary/50 to-primary/30 h-32 bg-gradient-to-r" />
          <CardContent className="relative px-6 pb-6">
            <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <Skeleton className="border-background h-24 w-24 rounded-full border-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
