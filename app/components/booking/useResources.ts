"use client";
import { useEffect, useState } from "react";
import { travelRequest } from "@/lib/client-api";
import { normalizeSettings } from "@/lib/settings";
import type { Settings } from "@/lib/booking-types";

export function useResource<T>(path: string) {
  const [state, setState] = useState<{ data?: T; error: string }>({ error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    travelRequest<{ data: T }>(path).then((result) => { const data = path === "settings" ? normalizeSettings(result.data as Settings) as T : result.data; if (!cancelled) setState({ data, error: "" }); }).catch((error) => { if (!cancelled) setState({ error: error.message || "Impossibile caricare i dati." }); });
    return () => { cancelled = true; };
  }, [path, attempt]);
  return { ...state, retry: () => { setState({ error: "" }); setAttempt((value) => value + 1); } };
}
