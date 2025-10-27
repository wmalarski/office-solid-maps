import { MT_WEBSITE_URL } from "./constants";

export const getTrailWidgetFrameSource = (trailId: string) => {
  return `${MT_WEBSITE_URL}/map/widget/route/h1l0p1/${trailId}.html`;
};

export const getTrailHref = (trailId: string) => {
  return `${MT_WEBSITE_URL}/route/${trailId}`;
};

export const getTrailWidgetHref = (trailId: string) => {
  const base = getTrailHref(trailId);
  return `${base}?utm_source=external_web&amp;utm_medium=widget&amp;utm_campaign=route_widget`;
};