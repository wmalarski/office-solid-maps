import { createResource, createSignal } from "solid-js";
import * as v from "valibot";

export const createTrailSelection = () => {
  const [trails, setTrails] = createSignal<string[]>([]);

  const onSelectionChanged = async (event: Excel.SelectionChangedEventArgs) => {
    const range = event.workbook.getSelectedRange();
    range.load({ valuesAsJson: true });

    await event.workbook.context.sync();

    const trailIds: string[] = [];

    range.valuesAsJson.flat().forEach((cell) => {
      const trailId = getCellTrailId(cell);
      trailId && trailIds.push(trailId);
    });

    setTrails(trailIds);
  };

  createResource(async () => {
    await Excel.run(async (context) => {
      context.workbook.onSelectionChanged.add(onSelectionChanged);
    });
  });

  return trails;
};

const getCellTrailId = (cell: Excel.CellValue) => {
  if (cell.type !== Excel.CellValueType.string) {
    return null;
  }

  const schema = v.nonNullish(
    v.pipe(
      v.string(),
      v.url(),
      v.transform((value) => new URL(value).pathname),
      v.regex(/^\/route\/[a-zA-Z0-9]+$/),
      v.transform((value) => value.split("/").at(2)),
    ),
  );

  const parsed = v.safeParse(schema, cell.basicValue);

  if (!parsed.success) {
    return null;
  }

  return parsed.output;
};
