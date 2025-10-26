import { createResource, createSignal } from "solid-js";
import * as v from "valibot";
import { MT_BASE_URL } from "./constants";

export const createTrailSelection = () => {
    const [trail, setTrail] = createSignal<string>()

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
        v.pipe(v.string(), v.url(), v.startsWith(MT_BASE_URL)),
        value.basicValue,
      );

      if (!parsed.success) {
        setTrail();
        return;
      }

      const url = new URL(parsed.output);

      const qValue = url.searchParams.get("q");

      if (qValue) {
        console.log("[qValue]", { qValue, url });
        setTrail();
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
