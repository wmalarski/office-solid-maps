import { Button, Card } from "@fluentui/web-components";
import type { ComponentProps } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "fluent-button": ComponentProps<"button"> &
        Partial<Pick<Button, "appearance">>;
      "fluent-card": ComponentProps<"div"> &
        Partial<Pick<Card, "cardFillColor" | "neutralPaletteSource">>;
    }
  }
}
