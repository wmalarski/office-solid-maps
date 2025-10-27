import { createResource, createSignal } from "solid-js";
import * as v from "valibot";
import { getTrailId } from "~/integrations/map/get-trail-id";
import { MT_WEBSITE_URL } from "../../integrations/map/constants";

export const createTrailSelection = () => {
  const [trail, setTrail] = createSignal<string>();

  const onSelectionChanged = async (event: Excel.SelectionChangedEventArgs) => {
    console.log("[event]", event);

    try {
      const range = event.workbook.getSelectedRange();
      range.load({ valuesAsJson: true });

      await event.workbook.context.sync();

      const value = range.valuesAsJson.at(0)?.at(0);

      if (!value || value.type !== Excel.CellValueType.string) {
        setTrail();
        return;
      }

      const parsed = await v.safeParseAsync(
        v.pipe(v.string(), v.url(), v.startsWith(`${MT_WEBSITE_URL}/route`)),
        value.basicValue,
      );

      if (!parsed.success) {
        setTrail();
        return;
      }

      const url = new URL(parsed.output);

      if (url.searchParams.has("q")) {
        const trailId = await getTrailId(url);
        console.log("[qValue]", { trailId, url });
        setTrail(trailId);
        return;
      }

      const lastPath = parsed.output.split("/").at(-1);

      setTrail(lastPath);
    } catch (error) {
      console.log("[error]", error);
    }
  };

  createResource(async () => {
    await Excel.run(async (context) => {
      context.workbook.onSelectionChanged.add(onSelectionChanged);
    });
  });

  return trail;
};
