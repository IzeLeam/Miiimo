import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center space-y-6 py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>

          <Link href="/">
            <Button size="lg" className="w-full">
              Go Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
