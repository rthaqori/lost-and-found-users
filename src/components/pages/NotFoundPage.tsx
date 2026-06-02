import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-sm p-0">
        {/* Decorative gradient bar */}
        <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500" />

        <CardContent className="space-y-6 pt-8">
          {/* 404 Number with floating effect */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-purple-100 opacity-50 blur-2xl dark:bg-purple-950/30" />
            </div>
            <div className="relative text-center">
              <p className="text-8xl font-black tracking-tighter text-gray-900 dark:text-gray-100">
                404
              </p>
              <div className="absolute -top-2 -right-4">
                <FileQuestion className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-950/30">
              <Search className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
            <CardDescription className="mt-3 text-base">
              The page you're looking for doesn't exist or has been moved.
              <br />
              Check the URL or try navigating back.
            </CardDescription>
          </div>

          {/* Helpful tip */}
          <div className="rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <p>💡 Tip: Double-check the web address for any typos</p>
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
