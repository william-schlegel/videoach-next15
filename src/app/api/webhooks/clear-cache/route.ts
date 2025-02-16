import { clearFullCache } from "@/lib/cache";

export async function GET() {
  clearFullCache();
  console.info("clearFullCache");
  return new Response("cahe cleared", { status: 200 });
}
