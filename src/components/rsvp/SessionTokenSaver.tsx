"use client";

import { useEffect } from "react";

export function SessionTokenSaver({ token }: { token: string }) {
  useEffect(() => {
    try {
      localStorage.setItem("wedding_guest_token", token);
    } catch {}
  }, [token]);

  return null;
}
