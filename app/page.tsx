"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response as AIMarkdownResponse } from "@/components/ai-elements/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSend, IconRobot } from "@tabler/icons-react";

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
    <main className="container mx-auto max-w-4xl p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><IconRobot className="size-5" />OpenRouter Chat</CardTitle>
        </CardHeader>
        <CardContent className="h-[65vh] min-h-0 flex flex-col gap-3">
          <div className="relative flex flex-1 min-h-0 rounded-lg border overflow-hidden">
            <Conversation className="h-full">
              <ConversationContent>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {(message as UIMessage).parts?.map((part: any, i: number) => {
                        if (part?.type === "text") {
                          return (
                            <AIMarkdownResponse key={`${message.id}-${i}`}>
                              {part.text}
                            </AIMarkdownResponse>
                          );
                        }
                        return null;
                      })}
                    </MessageContent>
                  </Message>
                ))}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLoading) return;
              const text = inputValue.trim();
              if (text.length === 0) return;
              void sendMessage({ text });
              setInputValue("");
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Say something..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || inputValue.trim().length === 0}>
              <IconSend className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
