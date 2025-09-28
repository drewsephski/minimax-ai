"use client";

import { cn } from "@/lib/utils";
import { Children, isValidElement, type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, components, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      components={{
        ...components,
        p: ({ children, ...rest }: any) => {
          const arrayChildren = Children.toArray(children).filter((ch: any) =>
            typeof ch === "string" ? ch.trim().length > 0 : true
          );

          const isImgEl = (el: any) =>
            isValidElement(el) &&
            (el.props?.node?.tagName === "img" || el.type === "img");

          const isImgLinkEl = (el: any) => {
            if (!isValidElement(el)) return false;
            const tag = el.props?.node?.tagName || el.type;
            if (tag !== "a") return false;
            const linkChildren = Children.toArray(el.props?.children || []).filter(
              (ch: any) => (typeof ch === "string" ? ch.trim().length > 0 : true)
            );
            return linkChildren.length === 1 && isImgEl(linkChildren[0]);
          };

          const onlyImages =
            arrayChildren.length > 0 &&
            arrayChildren.every((ch: any) => isImgEl(ch) || isImgLinkEl(ch));

          if (onlyImages) {
            return <div {...rest}>{children}</div>;
          }

          return <p {...rest}>{children}</p>;
        }
      }}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
