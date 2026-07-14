"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { parseContentPlatform } from "@/types/contentPlatform";

type AppMode = "ai-generate" | "analyze";

const VALID_MODES: AppMode[] = ["ai-generate", "analyze"];

type DashboardParamsProps = {
  setMode: (mode: AppMode) => void;
  setInitialBrief?: (brief: string) => void;
  setInitialPlatform?: (platform: ReturnType<typeof parseContentPlatform>) => void;
};

const DashboardParams = ({
  setMode,
  setInitialBrief,
  setInitialPlatform,
}: DashboardParamsProps) => {
  const searchParams = useSearchParams();
  const raw = searchParams.get("mode");
  const modeFromURL: AppMode = VALID_MODES.includes(raw as AppMode)
    ? (raw as AppMode)
    : "ai-generate";

  useEffect(() => {
    setMode(modeFromURL);
  }, [modeFromURL, setMode]);

  useEffect(() => {
    const brief = searchParams.get("brief");
    if (brief?.trim() && setInitialBrief) {
      setInitialBrief(brief.trim());
    }
    const platform = parseContentPlatform(searchParams.get("platform"));
    if (platform && setInitialPlatform) {
      setInitialPlatform(platform);
    }
  }, [searchParams, setInitialBrief, setInitialPlatform]);

  return null;
};

export default DashboardParams;
