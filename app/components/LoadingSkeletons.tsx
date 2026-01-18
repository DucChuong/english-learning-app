"use client";

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";

export function HomePageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Welcome Header Skeleton */}
      <div className="mb-6">
        <div className="h-10 bg-muted rounded-lg w-1/3 animate-pulse" />
      </div>

      {/* Progress Overview Skeleton */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-2/3 mb-3 animate-pulse" />
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Words Section */}
      <section className="mt-8">
        <div className="h-7 bg-muted rounded w-1/4 mb-4 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommended Words Section */}
      <section className="mt-8">
        <div className="h-7 bg-muted rounded w-1/4 mb-4 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="h-72">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-1/2 mb-2 animate-pulse" />
                <div className="h-8 bg-muted rounded w-2/3 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-4/5 animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ProgressPageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="h-10 bg-muted rounded-lg w-1/4 animate-pulse" />
      </div>

      {/* Progress Overview Skeleton */}
      <div className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-2/3 mb-3 animate-pulse" />
                <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-5 bg-muted rounded w-2/3 mb-3 animate-pulse" />
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress by Status */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-20 bg-muted rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export function TopicsPageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="h-10 bg-muted rounded-lg w-1/4 animate-pulse" />
      </div>

      {/* Topics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-32 cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              </div>
              <div className="h-10 w-10 bg-muted rounded-full ml-4 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

export function SentencesPageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="h-10 bg-muted rounded-lg w-1/4 animate-pulse" />
      </div>

      {/* Sentence Generator Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-32 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Saved Sentences */}
      <section>
        <div className="h-6 bg-muted rounded w-1/4 mb-4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="h-24">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-4/5 mb-2 animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/5 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

export function SettingsPageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="h-10 bg-muted rounded-lg w-1/4 animate-pulse" />
      </div>

      {/* Settings Sections */}
      <div className="max-w-2xl space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

export function LearnPageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6 h-10 w-32 bg-muted rounded animate-pulse" />

      <div className="max-w-4xl mx-auto">
        {/* Word Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4 mb-3 animate-pulse" />
            <div className="h-12 bg-muted rounded w-1/2 mb-2 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted rounded animate-pulse mb-6" />
            <div className="h-20 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>

        {/* Exercises */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4 mb-4 animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
