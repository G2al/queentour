"use client";
import { useEffect, useState } from "react";
import type { CartQuote, CartRequest } from "@/lib/booking-types";
import { RequestError, travelRequest } from "@/lib/client-api";
import { useCart } from "./CartProvider";

export function useCartQuote(payload: CartRequest | null) {
  const { agency, sessionVersion } = useCart();
  const serialized = payload ? JSON.stringify(payload) : "";
  const key = `${agency}:${sessionVersion}:${serialized}`;
  const [state, setState] = useState<{ key: string; quote?: CartQuote; error?: RequestError }>({ key: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!serialized) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      travelRequest<{ data: CartQuote }>("cart/quote", { method: "POST", body: serialized, signal: controller.signal }).then((result) => { if (!controller.signal.aborted) setState({ key, quote: result.data }); }).catch((error) => {
        if (!controller.signal.aborted) setState({ key, error: error instanceof RequestError ? error : new RequestError(503, "Il preventivo non è raggiungibile. Riprova.") });
      });
    }, 350);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [key, serialized, attempt]);
  return { quote: state.key === key ? state.quote : undefined, error: state.key === key ? state.error : undefined, loading: !!serialized && state.key !== key, retry: () => { setState({ key: "" }); setAttempt((value) => value + 1); } };
}
