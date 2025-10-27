import { createTrailSelection } from "./create-trail-selection";

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
  const selectedTrail = createTrailSelection();

  return (
    <div>
      <fluent-card class="p-4">
        <fluent-button onClick={run}>Click</fluent-button>
      </fluent-card>
      <pre>{JSON.stringify(selectedTrail(), null, 2)}</pre>
    </div>
  );
};
