import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/**
 * "Letters From Everyone" — a tiny guestbook.
 *   POST /api/letters            { author, message }  → anyone can write
 *   GET  /api/letters?password=… → only with the read password
 *
 * Storage: Upstash Redis (the free tier is plenty). On Vercel, add the
 * "Upstash for Redis" integration and these variables appear automatically
 * (either KV_REST_API_* or UPSTASH_REDIS_REST_*). Locally, put them in .env.local.
 *
 * Reading password: GUESTBOOK_READ_PASSWORD env var, falling back to the one
 * from the original site. Change it any time.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const READ_PASSWORD = process.env.GUESTBOOK_READ_PASSWORD || "120403";
const STORAGE_KEY = "minny_guestbook_letters"; // same key as the original site, so old letters keep working
const MAX_AUTHOR_LEN = 60;
const MAX_MESSAGE_LEN = 5000;
const MAX_LETTERS = 500; // safety cap so storage can't grow unbounded

type Letter = { author: string; message: string; date: string };

function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

const noStore = { headers: { "Cache-Control": "no-store" } };
const notReady = () =>
  NextResponse.json({ error: "The letterbox isn't connected yet — add the Redis settings (see README)." }, { status: 503, ...noStore });

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password") ?? "";
  if (password !== READ_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401, ...noStore });
  }
  const redis = getRedis();
  if (!redis) return notReady();
  try {
    const letters = (await redis.get<Letter[]>(STORAGE_KEY)) || [];
    const sorted = [...letters].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first
    return NextResponse.json({ letters: sorted }, noStore);
  } catch {
    return NextResponse.json({ error: "Could not load letters" }, { status: 500, ...noStore });
  }
}

export async function POST(req: NextRequest) {
  const redis = getRedis();
  if (!redis) return notReady();
  try {
    const body = await req.json().catch(() => ({}));
    const author = String(body?.author ?? "").trim().slice(0, MAX_AUTHOR_LEN);
    const message = String(body?.message ?? "").trim().slice(0, MAX_MESSAGE_LEN);
    if (!author || !message) {
      return NextResponse.json({ error: "Please include your name and a message." }, { status: 400, ...noStore });
    }
    const letters = (await redis.get<Letter[]>(STORAGE_KEY)) || [];
    letters.push({ author, message, date: new Date().toISOString() });
    await redis.set(STORAGE_KEY, letters.slice(-MAX_LETTERS));
    return NextResponse.json({ success: true }, noStore);
  } catch {
    return NextResponse.json({ error: "Could not save your letter" }, { status: 500, ...noStore });
  }
}
