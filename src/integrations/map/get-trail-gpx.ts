import { MT_WEBSITE_URL } from "./constants";

export const exportToGpx = async (trailId: string) => {
  const pathname = `${MT_WEBSITE_URL}/route/${trailId}.gpx`;

  const response = await fetch(pathname);

  const text = await response.text();

  return text;
};
