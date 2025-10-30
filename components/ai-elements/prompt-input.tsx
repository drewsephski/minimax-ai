"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconArrowUp, IconBolt, IconCode, IconPencil, IconQuestionMark, IconSparkles } from "@tabler/icons-react";

export type PromptInputMessage = {
  text?: string;
};

// Prompt suggestions aligned with the AI's personality and capabilities
const PROMPT_SUGGESTIONS = [
  {
    icon: IconCode,
    text: "Explain how React hooks work with a practical example",
    category: "technical"
  },
  {
    icon: IconBolt,
    text: "Write a story that starts with 'The last person on Earth sat alone in a room...'",
    category: "creative"
  },
  {
    icon: IconPencil,
    text: "Write me a creative response to a passive-aggressive email from my boss",
    category: "creative"
  },
  {
    icon: IconQuestionMark,
    text: "Help me write a persuasive email that gets a positive response",
    category: "creative"
  },
  {
    icon: IconSparkles,
    text: "Create a funny but professional out-of-office message for vacation",
    category: "creative"
  },
  {
    icon: IconCode,
    text: "Review this code thoroughly and suggest improvements",
    category: "technical"
  }
];

export type PromptSuggestion = {
  icon: React.ComponentType<React.ComponentProps<typeof IconBolt>>;
  text: string;
  category: string;
};

export type PromptInputProps = Omit<
  React.HTMLAttributes<HTMLFormElement>,
  "onSubmit"
> & {
  onSubmit: (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>
  ) => void;
  showSuggestions?: boolean;
  onSuggestionSelect?: (suggestion: string) => void;
};

export function PromptInput({ className, onSubmit, children, showSuggestions = false, onSuggestionSelect, ...props }: PromptInputProps) {
  const handleSuggestionSelect = React.useCallback((suggestion: string) => {
    onSuggestionSelect?.(suggestion);
  }, [onSuggestionSelect]);

  return (
    <div className={cn("w-full", className)}>
      <form
        className={cn(
          "relative w-full overflow-hidden rounded-xl border bg-background shadow-none min-h-20",
          showSuggestions && "rounded-b-none"
        )}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const text = (formData.get("message") as string) ?? "";
          onSubmit({ text }, e);
        }}
        {...props}
      >
        {children}
      </form>
      {showSuggestions && (
        <PromptSuggestions
          className="rounded-b-xl border-t-0"
          onSuggestionSelect={handleSuggestionSelect}
        />
      )}
    </div>
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

export type PromptSuggestionsProps = React.HTMLAttributes<HTMLDivElement> & {
  onSuggestionSelect: (suggestion: string) => void;
  suggestions?: PromptSuggestion[];
};
export function PromptSuggestions({ className, onSuggestionSelect, suggestions = PROMPT_SUGGESTIONS, ...props }: PromptSuggestionsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border-t bg-muted/30",
        className
      )}
      {...props}
    >
      <div className="col-span-full mb-2">
        <p className="text-sm text-muted-foreground font-medium">
          Try asking about:
        </p>
      </div>
      {suggestions.map((suggestion, index) => {
        const IconComponent = suggestion.icon;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSuggestionSelect(suggestion.text)}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors text-left group",
              "border-border/50 hover:border-border"
            )}
          >
            <div className="shrink-0 mt-0.5">
              <IconComponent className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-5 group-hover:text-foreground transition-colors">
                {suggestion.text}
              </p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {suggestion.category}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

