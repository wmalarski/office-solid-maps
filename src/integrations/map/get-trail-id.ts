import { MT_WEBSITE_URL } from "./constants";

export const getTrailId = async (url: URL) => {
  const routeQuery = url.searchParams.get("q") as string;

  const formData = new FormData();

  formData.set("display_label", "true");
  formData.set("event_category", "Route details");
  formData.set("route_query", routeQuery);
  formData.set("route_type", "v=foot,m=hiking");

  const response = await fetch(`${MT_WEBSITE_URL}/widget/route`, {
    body: formData,
    method: "post",
  });

  console.log("[response]", response.status, response.statusText);

  const text = await response.text();

  console.log("[response]", text);

  const matches = text.match(/action=(.*)\.html/g);
  const trailId = matches?.[0].split(/(\/|\.)/).at(-3);

  return trailId;
};
