import { I18nContextProvider } from "~/integrations/i18n";
import { TrailsPanel } from "./trails/trails-panel";

export const App = () => {
  return (
    <I18nContextProvider>
      <TrailsPanel />
    </I18nContextProvider>
  );
};
