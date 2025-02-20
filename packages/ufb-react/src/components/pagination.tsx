/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import * as React from "react";

import type { ButtonProps } from "./button";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";

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
      variant="ghost"
      size={size ?? DefaultValue.size}
      radius={radius ?? DefaultValue.radius}
      aria-label="Go to previous page"
      className={cn("pagination-previous", className)}
      asChild
    >
      <a {...props}>
        <Icon name="RiArrowLeftSLine" />
        Previous
      </a>
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
      variant="ghost"
      size={size ?? DefaultValue.size}
      radius={radius ?? DefaultValue.radius}
      aria-label="Go to next page"
      className={cn("pagination-next", className)}
      asChild
    >
      <a {...props}>
        Next
        <Icon name="RiArrowRightSLine" />
      </a>
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
    <Button
      {...props}
      variant="ghost"
      aria-label="More Pages"
      size={size ?? DefaultValue.size}
      radius={radius ?? DefaultValue.radius}
      className={cn("pagination-ellipsis", className)}
    >
      <Icon name="RiMoreLine" />
    </Button>
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
