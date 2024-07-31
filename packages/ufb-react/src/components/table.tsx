import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="table-wrap">
    <table ref={ref} className={cn("table", className)} {...props} />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("table-header", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("table-body", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("table-footer", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("table-row", className)} {...props} />
));
TableRow.displayName = "TableRow";

const tableHeadVariants = cva("table-head", {
  variants: {
    textAlign: {
      left: "table-head-left",
      center: "table-head-center",
      right: "table-head-right",
    },
  },
  defaultVariants: {
    textAlign: "left",
  },
});

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> &
    VariantProps<typeof tableHeadVariants> & {
      icon?: IconNameType;
    }
>(({ icon, textAlign = "left", children, className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(tableHeadVariants({ textAlign, className }))}
    {...props}
  >
    {icon && <Icon name={icon} size={16} />}
    {children}
  </th>
));
TableHead.displayName = "TableHead";

const tableCellVariants = cva("table-cell", {
  variants: {
    textAlign: {
      left: "table-cell-left",
      center: "table-cell-center",
      right: "table-cell-right",
    },
  },
  defaultVariants: {
    textAlign: "left",
  },
});

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> &
    VariantProps<typeof tableCellVariants>
>(({ textAlign = "left", className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(tableCellVariants({ textAlign, className }))}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("table-caption", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
