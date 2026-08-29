"use client";

import type { PasteExpiration, PasteLanguage, PasteVisibility } from "@/lib/utils/paste";

export interface PasteFormInput {
  title: string;
  content: string;
  language: PasteLanguage;
  visibility: PasteVisibility;
  expiration: PasteExpiration;
}

export interface MutatePasteResult {
  ok: boolean;
  id?: string;
  error?: string;
  code?: "not_configured";
}

export async function createPaste(input: PasteFormInput): Promise<MutatePasteResult> {
  try {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return (await res.json()) as MutatePasteResult;
  } catch {
    return { ok: false, error: "Network error. Try again." };
  }
}

export async function updatePaste(id: string, input: PasteFormInput): Promise<MutatePasteResult> {
  try {
    const res = await fetch(`/api/pastes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return (await res.json()) as MutatePasteResult;
  } catch {
    return { ok: false, error: "Network error. Try again." };
  }
}

export async function deletePaste(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/pastes/${id}`, { method: "DELETE" });
    return await res.json();
  } catch {
    return { ok: false, error: "Network error. Try again." };
  }
}

export interface PasteSummary {
  id: string;
  title: string;
  language: PasteLanguage;
  visibility: PasteVisibility;
  createdAt: string;
  expiresAt: string | null;
}

export interface ListPastesResult {
  ok: boolean;
  pastes: PasteSummary[];
  error?: string;
  code?: "not_configured";
}

export async function listMyPastes(): Promise<ListPastesResult> {
  try {
    const res = await fetch("/api/pastes");
    return (await res.json()) as ListPastesResult;
  } catch {
    return { ok: false, pastes: [], error: "Network error. Try again." };
  }
}
