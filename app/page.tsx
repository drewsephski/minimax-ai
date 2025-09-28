"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Response as AIMarkdownResponse } from "@/components/ai-elements/response";
import { Card, CardContent } from "@/components/ui/card";
// removed unused imports
import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputToolbar, PromptInputSubmit } from "@/components/ai-elements/prompt-input";

export default function Home() {
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({ api: "/api/chat" }),
    experimental_throttle: 50,
  });
  const [inputValue, setInputValue] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  function getMessageText(message: UIMessage): string {
    const parts = (message as any).parts as Array<any> | undefined;
    if (Array.isArray(parts)) {
      return parts
        .map((part) => (part && part.type === "text" ? String(part.text ?? "") : ""))
        .join("");
    }
    const content = (message as any).content;
    return typeof content === "string" ? content : "";
  }

  return (
    <main className="container mx-auto max-w-4xl p-6 md:p-8 min-h-screen flex items-center justify-center">
      <Card className="w-full bg-transparent border-0 shadow-none">
        <CardContent className="h-[calc(100vh-8rem)] min-h-0 flex flex-col gap-3 p-0 pb-16">
          <div className="relative flex flex-1 min-h-0 rounded-lg overflow-hidden">
            <Conversation className="h-full">
              <ConversationContent className="px-3 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4 pb-28 md:pb-32">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    {message.role === "user" ? (
                      <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-muted text-foreground leading-relaxed text-sm md:text-base">
                        {getMessageText(message as UIMessage)}
                      </div>
                    ) : (
                      <div className="max-w-[85%] leading-relaxed">
                        {(message as UIMessage).parts?.map((part: any, i: number) =>
                          part?.type === "text" ? (
                            <AIMarkdownResponse key={`${message.id}-${i}`} className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                              {part.text}
                            </AIMarkdownResponse>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          <PromptInput
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl"
            onSubmit={(e) => {
              if (isLoading) return;
              const text = (e.text ?? "").trim();
              if (!text) return;
              void sendMessage({ text });
              setInputValue("");
            }}
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Say something..."
                value={inputValue}
                onChange={(ev) => setInputValue(ev.currentTarget.value)}
                disabled={isLoading}
              />
            </PromptInputBody>
            <PromptInputToolbar>
              <PromptInputSubmit disabled={isLoading || inputValue.trim().length === 0} />
            </PromptInputToolbar>
          </PromptInput>
        </CardContent>
      </Card>
    </main>
  );
}
