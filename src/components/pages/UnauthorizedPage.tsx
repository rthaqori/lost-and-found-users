import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Home, ArrowLeft, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-sm p-0">
        {/* Red accent bar at the top */}
        <div className="h-2 bg-red-500" />

        <CardContent className="space-y-6 pt-8">
          {/* Icon with pulse animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20" />
              <div className="relative rounded-full bg-red-100 p-4 dark:bg-red-950/30">
                <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Error code */}
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wider text-red-500 uppercase">
              Error 403
            </p>
            <CardTitle className="mt-2 text-3xl font-bold">
              Unauthorized Access
            </CardTitle>
            <CardDescription className="mt-3 text-base">
              You don't have permission to access this page.
              <br />
              Please contact your administrator if you believe this is a
              mistake.
            </CardDescription>
          </div>

          {/* Lock icon decoration */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <Lock className="h-3 w-3" />
              <span>Authentication Required</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-3 pb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
