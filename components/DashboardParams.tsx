"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { parseContentPlatform } from "@/types/contentPlatform";

type AppMode = "ai-generate" | "analyze";

const VALID_MODES: AppMode[] = ["ai-generate", "analyze"];

type DashboardParamsProps = {
  setMode: (mode: AppMode) => void;
  setDocumentId?: (id: string | null) => void;
  setInitialBrief?: (brief: string) => void;
  setInitialPlatform?: (platform: ReturnType<typeof parseContentPlatform>) => void;
  onDocumentIdFromUrl?: (documentId: string) => void;
};

const DashboardParams = ({
  setMode,
  setDocumentId,
  setInitialBrief,
  setInitialPlatform,
  onDocumentIdFromUrl,
}: DashboardParamsProps) => {
  const searchParams = useSearchParams();
  const raw = searchParams.get("mode");
  const modeFromURL: AppMode = VALID_MODES.includes(raw as AppMode)
    ? (raw as AppMode)
    : "ai-generate";
  const documentIdFromUrl = searchParams.get("documentId");

  useEffect(() => {
    setMode(modeFromURL);
  }, [modeFromURL, setMode]);

  useEffect(() => {
    if (documentIdFromUrl) {
      setDocumentId?.(documentIdFromUrl);
      localStorage.setItem("documentId", documentIdFromUrl);
      onDocumentIdFromUrl?.(documentIdFromUrl);
    }
  }, [documentIdFromUrl, setDocumentId, onDocumentIdFromUrl]);

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
