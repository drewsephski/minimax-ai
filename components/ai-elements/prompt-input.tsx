"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconArrowUp } from "@tabler/icons-react";

export type PromptInputMessage = {
  text?: string;
};

export type PromptInputProps = Omit<
  React.HTMLAttributes<HTMLFormElement>,
  "onSubmit"
> & {
  onSubmit: (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>
  ) => void;
};

export function PromptInput({ className, onSubmit, ...props }: PromptInputProps) {
  return (
    <form
      className={cn(
        "relative w-full overflow-hidden rounded-xl border bg-background shadow-none min-h-20",
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        const text = (e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement | null)?.value ?? "";
        onSubmit({ text }, e);
      }}
      {...props}
    />
  );
}

export type PromptInputBodyProps = React.HTMLAttributes<HTMLDivElement>;
export function PromptInputBody({ className, ...props }: PromptInputBodyProps) {
  return <div className={cn("flex flex-col", className)} {...props} />;
}

export type PromptInputTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export function PromptInputTextarea({ className, onChange, ...props }: PromptInputTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const autoResize = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const max = 160; // px (10rem)
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, max) + "px";
  }, []);

  React.useLayoutEffect(() => {
    autoResize();
  }, [autoResize, props.value]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };
  return (
    <textarea
      name="message"
      className={cn(
        "w-full resize-none rounded-none border-none p-3 pr-16 md:pr-20 shadow-none outline-none ring-0",
        "bg-transparent dark:bg-transparent",
        "max-h-40 min-h-12 focus-visible:ring-0 overflow-auto",
        className
      )}
      ref={textareaRef}
      onKeyDown={handleKeyDown}
      rows={1}
      onChange={(e) => {
        autoResize();
        onChange?.(e);
      }}
      {...props}
    />
  );
}

export type PromptInputToolbarProps = React.HTMLAttributes<HTMLDivElement>;
export function PromptInputToolbar({ className, ...props }: PromptInputToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end p-2 md:p-3 border-t",
        className
      )}
      {...props}
    />
  );
}

export type PromptInputSubmitProps = React.ComponentProps<typeof Button> & {
  disabled?: boolean;
};
export function PromptInputSubmit({ className, disabled, children, ...props }: PromptInputSubmitProps) {
  return (
    <Button
      type="submit"
      size="icon"
      className={cn(
        "pointer-events-auto rounded-lg transition-colors size-9 md:size-10",
        disabled ? "bg-transparent text-muted-foreground" : "bg-foreground text-background hover:opacity-90",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children ?? <IconArrowUp className="size-4" />}
    </Button>
  );
}


