import { getSitesFromDistance } from "@/server/site";
import { LATITUDE, LONGITUDE } from "@lib/defaultValues";

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;

  const locationLng: number = parseInt(
    searchParams.get("locationLng") ?? LONGITUDE.toString(),
    10,
  );
  const locationLat: number = parseInt(
    searchParams.get("locationLat") ?? LATITUDE.toString(),
    10,
  );
  const range: number = parseInt(searchParams.get("range") ?? "25", 10);
  try {
    const sites = await getSitesFromDistance({
      locationLng,
      locationLat,
      range,
    });

    return sites;
  } catch (error) {
    console.error("Erreur lors de la récupération des sites:", error);
    return new Response("Erreur lors de la récupération des sites", {
      status: 500,
    });
  }
}
