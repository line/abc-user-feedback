import * as React from "react";

import type { ButtonProps } from "./button";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { IconButton } from "./icon-button";

const DefaultValue = {
  size: "small",
  radius: "medium",
} as const;
const PaginationContext = React.createContext<ButtonProps>({
  size: DefaultValue.size,
  radius: DefaultValue.radius,
});

type PaginationProps = React.ComponentProps<"nav"> &
  Pick<ButtonProps, "size" | "radius">;
const Pagination = ({
  size = DefaultValue.size,
  radius = DefaultValue.radius,
  className,
  ...props
}: PaginationProps) => (
  <PaginationContext.Provider value={{ size, radius }}>
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("pagination", className)}
      {...props}
    />
  </PaginationContext.Provider>
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("pagination-content", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("pagination-item", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => {
  const { size, radius } = React.useContext(PaginationContext);
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size ?? DefaultValue.size}
      radius={radius ?? DefaultValue.radius}
      className={cn("pagination-link", className)}
      asChild
    >
      <a {...props} aria-current={isActive ? "page" : undefined} />
    </Button>
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { size, radius } = React.useContext(PaginationContext);
  return (
    <Button
      iconL="RiArrowLeftSLine"
      variant="ghost"
      size={size ?? DefaultValue.size}
      radius={radius ?? DefaultValue.radius}
      aria-label="Go to previous page"
      className={cn("pagination-previous", className)}
      asChild
    >
      <a {...props}>Previous</a>
    </Button>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { size, radius } = React.useContext(PaginationContext);
  return (
    <Button
      iconR="RiArrowRightSLine"
      variant="ghost"
      size={size ?? DefaultValue.size}
      radius={radius ?? DefaultValue.radius}
      aria-label="Go to next page"
      className={cn("pagination-next", className)}
      asChild
    >
      <a {...props}>Next</a>
    </Button>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"button">) => {
  const { size, radius } = React.useContext(PaginationContext);
  return (
    <IconButton
      {...props}
      icon="RiMoreLine"
      variant="ghost"
      aria-label="More Pages"
      size={size ?? DefaultValue.size}
      radius={radius ?? DefaultValue.radius}
      className={cn("pagination-ellipsis", className)}
    />
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
