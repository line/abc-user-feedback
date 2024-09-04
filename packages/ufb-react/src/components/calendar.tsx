import type { DateRange, DayPickerDefaultProps } from "react-day-picker";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "../lib/utils";
import { Icon } from "./icon";

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  showToday?: boolean;
};

function Calendar({
  className,
  classNames,
  showToday = true,
  showOutsideDays = true,
  mode = "default",
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      mode={mode as DayPickerDefaultProps["mode"]}
      showOutsideDays={showOutsideDays}
      className={cn("calendar", className)}
      classNames={{
        months: "calendar-months",
        month: "calendar-month",
        caption: "calendar-caption",
        caption_label: "calendar-caption-label",
        nav: "calendar-nav",
        nav_button: "calendar-nav-button",
        nav_button_previous: "calendar-nav-button-previous",
        nav_button_next: "calendar-nav-button-next",
        table: "calendar-table",
        head_row: "calendar-head-row",
        head_cell: "calendar-head-cell",
        row: "calendar-row",
        cell: "calendar-cell",
        day: "calendar-day",
        day_range_start: "calendar-day-range-start",
        day_range_end: "calendar-day-range-end",
        day_selected: "calendar-day-selected",
        day_today: showToday ? "calendar-day-today" : "",
        day_outside: "calendar-day-outside",
        day_disabled: "calendar-day-disabled",
        day_range_middle: "calendar-day-range-middle",
        day_hidden: "calendar-day-hidden",
        ...classNames,
      }}
      components={{
        IconLeft: () => <Icon name="RiArrowLeftSLine" size={16} />,
        IconRight: () => <Icon name="RiArrowRightSLine" size={16} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar, type DateRange, type CalendarProps };
