"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Check, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

const IELTS_LEVELS = [
  {
    value: 4.0,
    label: "4.0 - Limited User",
    description: "Basic understanding",
  },
  {
    value: 4.5,
    label: "4.5 - Limited User",
    description: "Basic understanding",
  },
  { value: 5.0, label: "5.0 - Modest User", description: "Partial command" },
  { value: 5.5, label: "5.5 - Modest User", description: "Partial command" },
  {
    value: 6.0,
    label: "6.0 - Competent User",
    description: "Generally effective",
  },
  {
    value: 6.5,
    label: "6.5 - Competent User",
    description: "Generally effective",
  },
  { value: 7.0, label: "7.0 - Good User", description: "Operational command" },
  { value: 7.5, label: "7.5 - Good User", description: "Operational command" },
  {
    value: 8.0,
    label: "8.0 - Very Good User",
    description: "Fully operational",
  },
  {
    value: 8.5,
    label: "8.5 - Very Good User",
    description: "Fully operational",
  },
  { value: 9.0, label: "9.0 - Expert User", description: "Fully operational" },
];

export function IeltsLevelSelector() {
  const [ieltsLevel, setIeltsLevel] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLevel();
  }, []);

  const fetchLevel = async () => {
    try {
      const response = await fetch("/api/user/level");
      if (!response.ok) throw new Error("Failed to fetch level");
      const data = await response.json();
      setIeltsLevel(data.ieltsLevel);
    } catch (err) {
      console.error("Error fetching level:", err);
      setError("Failed to load your IELTS level");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/user/level", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ieltsLevel }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save level");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save IELTS level"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          IELTS Level
        </CardTitle>
        <CardDescription>
          Set your IELTS level to get personalized word recommendations and
          sentence generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ielts-level">Your IELTS Level</Label>
          <Select
            value={ieltsLevel?.toString() || "none"}
            onValueChange={(value) =>
              setIeltsLevel(value === "none" ? null : parseFloat(value))
            }
          >
            <SelectTrigger id="ielts-level">
              <SelectValue placeholder="Select your IELTS level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not set</SelectItem>
              {IELTS_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{level.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {level.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {ieltsLevel && (
            <p className="text-sm text-muted-foreground">
              AI will generate content appropriate for IELTS {ieltsLevel} level
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              IELTS level saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Level
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
