"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type AppMode = "ai-generate" | "analyze";

const VALID_MODES: AppMode[] = ["ai-generate", "analyze"];

const DashboardParams = ({ setMode }: { setMode: (mode: AppMode) => void }) => {
  const searchParams = useSearchParams();
  const raw = searchParams.get("mode");
  const modeFromURL: AppMode = VALID_MODES.includes(raw as AppMode)
    ? (raw as AppMode)
    : "ai-generate";

  useEffect(() => {
    setMode(modeFromURL);
  }, [modeFromURL, setMode]);

  return null;
};

export default DashboardParams;
