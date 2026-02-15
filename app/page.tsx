"use client";

import { useState, useCallback } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { PhotoUpload } from "@/components/photo-upload";
import { AnalyzingLoader } from "@/components/analyzing-loader";
import { VibeResults } from "@/components/vibe-results";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  score: number;
  smileMeter: number;
  feedback: string[];
}

export default function Page() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (base64: string) => {
    setPreview(base64);
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setResult(data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setPreview(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center gap-2.5 py-6 border-b border-border">
        <Heart className="h-5 w-5 text-primary" fill="hsl(var(--primary))" />
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          Autopilot Dates
        </span>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 md:py-16">
        <div className="w-full max-w-md">
          {/* Hero */}
          {!preview && (
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
                Get your photo
                <span className="text-primary"> vibe-checked</span>
              </h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Upload a photo and our AI will score your dating profile
                potential with honest, helpful feedback.
              </p>
            </div>
          )}

          {/* Upload / Preview Card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <PhotoUpload
              onUpload={handleUpload}
              isAnalyzing={isAnalyzing}
              preview={preview}
              onClear={handleClear}
            />

            {/* Loading State */}
            {isAnalyzing && <AnalyzingLoader />}

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Results */}
            {result && !isAnalyzing && (
              <div className="mt-6">
                <VibeResults
                  score={result.score}
                  smileMeter={result.smileMeter}
                  feedback={result.feedback}
                />
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="mt-6 w-full gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Another Photo
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Powered by AI. Your photos are not stored.
          </p>
        </div>
      </div>
    </main>
  );
}
