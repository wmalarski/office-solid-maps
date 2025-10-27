import { createResource, createSignal } from "solid-js";
import * as v from "valibot";
import { getTrailId } from "~/integrations/map/get-trail-id";
import { MT_WEBSITE_URL } from "../../integrations/map/constants";

export const createTrailSelection = () => {
  const [trails, setTrails] = createSignal<string[]>();

  const onSelectionChanged = async (event: Excel.SelectionChangedEventArgs) => {
    console.log("[event]", event);

    try {
      const range = event.workbook.getSelectedRange();
      range.load({ valuesAsJson: true });

      await event.workbook.context.sync();

      const trailIdPromises = range.valuesAsJson.flat().map(getCellTrailId);
      const resolvedTrailIds = await Promise.all(trailIdPromises);

      const trailIds: string[] = [];

      resolvedTrailIds.forEach((trailId) => {
        trailId && trailIds.push(trailId);
      });

      setTrails(trailIds);
    } catch (error) {
      console.log("[error]", error);
    }
  };

  createResource(async () => {
    await Excel.run(async (context) => {
      context.workbook.onSelectionChanged.add(onSelectionChanged);
    });
  });

  return trails;
};

const getCellTrailId = async (cell: Excel.CellValue) => {
  if (!cell || cell.type !== Excel.CellValueType.string) {
    return null;
  }

  const parsed = await v.safeParseAsync(
    v.pipe(v.string(), v.url(), v.startsWith(`${MT_WEBSITE_URL}/route`)),
    cell.basicValue,
  );

  if (!parsed.success) {
    return null;
  }

  const url = new URL(parsed.output);

  if (url.searchParams.has("q")) {
    const trailId = await getTrailId(url);
    return trailId ?? null;
  }

  const lastPath = parsed.output.split("/").at(-1);
  return lastPath ?? null;
};
