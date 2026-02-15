"use client";

import { Sparkles } from "lucide-react";

export function AnalyzingLoader() {
  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
          <Sparkles className="h-7 w-7 text-primary animate-pulse-glow" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-lg font-display font-semibold text-foreground">
          Analyzing Vibe...
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Our AI is judging you (nicely)
        </p>
      </div>
    </div>
  );
}
