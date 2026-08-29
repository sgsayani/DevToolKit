import { randomUUID } from "crypto";
import { getDb } from "@/lib/server/mongodb";
import type { PasteLanguage, PasteVisibility } from "@/lib/utils/paste";

export interface PasteDocument {
  // The paste's own public id doubles as the Mongo _id — there is no
  // separate ObjectId to ever accidentally expose, since this value IS the
  // public identifier by design (a non-guessable UUIDv4).
  _id: string;
  title: string;
  content: string;
  language: PasteLanguage;
  visibility: PasteVisibility;
  ownerHash: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
}

export interface CreatePasteInput {
  title: string;
  content: string;
  language: PasteLanguage;
  visibility: PasteVisibility;
  ownerHash: string;
  expiresAt: Date | null;
}

export interface UpdatePasteInput {
  title: string;
  content: string;
  language: PasteLanguage;
  visibility: PasteVisibility;
  expiresAt: Date | null;
}

const COLLECTION = "pastes";
let indexesEnsured: Promise<void> | null = null;

async function pastesCollection() {
  const db = await getDb();
  const collection = db.collection<PasteDocument>(COLLECTION);
  if (!indexesEnsured) {
    indexesEnsured = Promise.all([
      collection.createIndex({ ownerHash: 1, createdAt: -1 }),
      // TTL index: MongoDB's own background reaper deletes documents once
      // expiresAt is in the past — no cron job or app-level cleanup process
      // needed. Documents with expiresAt: null are never touched by it.
      collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]).then(() => undefined);
  }
  await indexesEnsured;
  return collection;
}

/** The TTL index reaps expired docs in the background on its own schedule
 * (up to ~60s late) — this filter is the authoritative, immediate check
 * applied to every read so an expired paste is never served in the gap. */
function notExpiredFilter() {
  return { $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] };
}

export async function createPaste(input: CreatePasteInput): Promise<PasteDocument> {
  const collection = await pastesCollection();
  const now = new Date();
  const doc: PasteDocument = {
    _id: randomUUID(),
    title: input.title,
    content: input.content,
    language: input.language,
    visibility: input.visibility,
    ownerHash: input.ownerHash,
    createdAt: now,
    updatedAt: now,
    expiresAt: input.expiresAt,
  };
  await collection.insertOne(doc);
  return doc;
}

export async function getPasteById(id: string): Promise<PasteDocument | null> {
  const collection = await pastesCollection();
  return collection.findOne({ _id: id, ...notExpiredFilter() });
}

export async function listPastesByOwner(ownerHash: string): Promise<PasteDocument[]> {
  const collection = await pastesCollection();
  return collection
    .find({ ownerHash, ...notExpiredFilter() })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
}

/** Filters by _id AND ownerHash in the same atomic query — the only place
 * "is this my paste?" is enforced for writes, so there's no separate
 * read-then-check race a caller could exploit. */
export async function updateOwnedPaste(
  id: string,
  ownerHash: string,
  input: UpdatePasteInput,
): Promise<boolean> {
  const collection = await pastesCollection();
  const result = await collection.updateOne(
    { _id: id, ownerHash },
    { $set: { ...input, updatedAt: new Date() } },
  );
  return result.matchedCount > 0;
}

export async function deleteOwnedPaste(id: string, ownerHash: string): Promise<boolean> {
  const collection = await pastesCollection();
  const result = await collection.deleteOne({ _id: id, ownerHash });
  return result.deletedCount > 0;
}
