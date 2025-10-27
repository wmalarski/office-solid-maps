import { For } from "solid-js";
import { createTrailSelection } from "./create-trail-selection";
import { TrailWidget } from "./trail-widget";

export async function run() {
  try {
    await Excel.run(async (context) => {
      /**
       * Insert your Excel code here
       */
      const range = context.workbook.getSelectedRange();

      // Read the range address
      range.load("address");

      // Update the fill color
      range.format.fill.color = "green";

      await context.sync();
      console.log(`The range address was ${range.address}.`);
    });
  } catch (error) {
    console.error(error);
  }
}

export const TrailsPanel = () => {
  const selectedTrails = createTrailSelection();

  return (
    <div>
      <fluent-card class="p-4">
        <fluent-button onClick={run}>Click</fluent-button>
      </fluent-card>
      <For each={selectedTrails()}>
        {(trailId) => <TrailWidget trailId={trailId} />}
      </For>
      <pre>{JSON.stringify(selectedTrails(), null, 2)}</pre>
    </div>
  );
};
