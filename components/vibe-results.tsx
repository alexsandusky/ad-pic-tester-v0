"use client";

import { Smile, Star, MessageCircle } from "lucide-react";

interface VibeResultsProps {
  score: number;
  smileMeter: number;
  feedback: string[];
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 10) * circumference;

  const getColor = (s: number) => {
    if (s >= 8) return "text-emerald-400";
    if (s >= 5) return "text-amber-400";
    return "text-red-400";
  };

  const getStrokeColor = (s: number) => {
    if (s >= 8) return "stroke-emerald-400";
    if (s >= 5) return "stroke-amber-400";
    return "stroke-red-400";
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="8"
        />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          className={getStrokeColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-display font-bold ${getColor(score)}`}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground font-medium">/10</span>
      </div>
    </div>
  );
}

function SmileMeter({ percentage }: { percentage: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Smile className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Smile Meter
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-right text-sm font-medium text-muted-foreground">
        {percentage}%
      </span>
    </div>
  );
}

export function VibeResults({ score, smileMeter, feedback }: VibeResultsProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Star className="h-3.5 w-3.5" />
          <span>Vibe Score</span>
        </div>
        <ScoreRing score={score} />
      </div>

      <SmileMeter percentage={smileMeter} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Feedback
          </span>
        </div>
        <ul className="flex flex-col gap-2.5">
          {feedback.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg bg-secondary/50 px-4 py-3"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-sm text-foreground leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
