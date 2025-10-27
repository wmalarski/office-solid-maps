import type { Component } from "solid-js";
import { useI18n } from "~/integrations/i18n";
import {
  getTrailWidgetFrameSource,
  getTrailWidgetHref,
} from "~/integrations/map/get-trail-widget";

type TrailWidgetProps = {
  trailId: string;
};

export const TrailWidget: Component<TrailWidgetProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="mx-auto my-0 min-w-[300px] max-w-[600px] overflow-hidden">
      <iframe
        class="w-full border-0"
        height="680"
        loading="lazy"
        src={getTrailWidgetFrameSource(props.trailId)}
        title="widget"
      />
      <a
        href={getTrailWidgetHref(props.trailId)}
        rel="noopener"
        style="text-[#999] text-[13px] inline-block px-0 py-[7px]"
        target="_blank"
      >
        {t("map.credit")}
      </a>
    </div>
  );
};
