"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { EnhancedResponse } from "@/components/ai-elements/enhanced-response";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputToolbar, PromptInputSubmit, PromptSuggestions } from "@/components/ai-elements/prompt-input";
import { toast } from "sonner";
import { Download, Trash2, Copy, Check } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({ api: "/api/chat" }),
    experimental_throttle: 50,
  });
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const isLoading = status === "submitted" || status === "streaming";

  // Check if we should show prompt suggestions (no messages yet)
  const showPromptSuggestions = messages.length === 0;

  const handleSuggestionSelect = (suggestion: string) => {
    setInputValue(suggestion);
  };

  function getMessageText(message: UIMessage): string {
    interface MessagePart {
      type: string;
      text?: string;
    }
    
    const parts = (message as unknown as { parts?: MessagePart[] }).parts;
    if (Array.isArray(parts)) {
      return parts
        .map((part) => (part && part.type === "text" ? String(part.text ?? "") : ""))
        .join("");
    }
    const content = (message as unknown as { content?: string }).content;
    return typeof content === "string" ? content : "";
  }

  const handleCopyConversation = async () => {
    try {
      const conversationText = messages.map(msg => {
        const role = msg.role === "user" ? "You" : "Assistant";
        const text = getMessageText(msg as UIMessage);
        return `${role}: ${text}`;
      }).join("\n\n");
      
      await navigator.clipboard.writeText(conversationText);
      setCopied(true);
      toast.success("Conversation copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy conversation");
    }
  };

  const handleDownloadConversation = () => {
    try {
      const conversationText = messages.map(msg => {
        const role = msg.role === "user" ? "You" : "Assistant";
        const text = getMessageText(msg as UIMessage);
        return `${role}: ${text}`;
      }).join("\n\n");
      
      const blob = new Blob([conversationText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `conversation-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Conversation downloaded");
    } catch {
      toast.error("Failed to download conversation");
    }
  };

  const handleClearConversation = () => {
    // Reset messages by sending an empty reload request
    window.location.reload();
  };

  return (
    <main className="container mx-auto max-w-4xl p-6 md:p-8 min-h-screen flex items-center justify-center">
      <Card className="w-full bg-transparent border-0 shadow-none">
        <CardContent className={`min-h-0 flex flex-col gap-3 p-0 ${showPromptSuggestions ? 'h-auto' : 'h-[calc(100vh-8rem)] pb-16'}`}>
          {/* Action buttons */}
          {messages.length > 0 && (
            <div className="flex items-center justify-between px-3 md:px-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyConversation}
                  className="h-8"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadConversation}
                  className="h-8"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearConversation}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              <div className="flex gap-2">
                <ThemeToggle />
              </div>
            </div>
          )}

          {/* Theme toggle for welcome state */}
          {showPromptSuggestions && (
            <div className="flex justify-end px-3 md:px-6">
            </div>
          )}

          <div className="relative flex flex-1 min-h-0 rounded-lg overflow-hidden">
            <Conversation className="h-full">
              <ConversationContent className={`px-3 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4 ${showPromptSuggestions ? 'pb-4' : 'pb-20'}`}>
                {/* Message list */}
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
                        {(message as UIMessage).parts?.map((part: { type: string; text?: string }, i: number) =>
                          part?.type === "text" ? (
                            <EnhancedResponse key={`${message.id}-${i}`} className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                              {part.text}
                            </EnhancedResponse>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted/50 text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        <span className="ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show welcome message and prompt input when no messages */}
                {showPromptSuggestions ? (
                  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8">
                    <div className="space-y-2">
                      <h1 className="text-4xl font-semibold">Welcome to MiniMax AI</h1>
                      <p className="text-muted-foreground text-sm">Choose a suggestion below or type your message...</p>
                    </div>
                    
                    {/* Prompt suggestions positioned above input */}
                    <div className="w-full max-w-2xl space-y-4">
                      <PromptSuggestions
                        onSuggestionSelect={handleSuggestionSelect}
                        className="rounded-lg"
                      />
                      
                      {/* Prompt input positioned below suggestions */}
                      <PromptInput
                        showSuggestions={false}
                        onSuggestionSelect={handleSuggestionSelect}
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
                            placeholder="Type your message or select a suggestion above..."
                            value={inputValue}
                            onChange={(ev) => setInputValue(ev.currentTarget.value)}
                            disabled={isLoading}
                          />
                        </PromptInputBody>
                        <PromptInputToolbar>
                          <PromptInputSubmit disabled={isLoading || inputValue.trim().length === 0} />
                        </PromptInputToolbar>
                      </PromptInput>
                    </div>
                  </div>
                ) : null}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          {/* Fixed prompt input when messages exist */}
          {!showPromptSuggestions && (
            <PromptInput
              className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl"
              showSuggestions={false}
              onSuggestionSelect={handleSuggestionSelect}
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
          )}
        </CardContent>
      </Card>
    </main>
  );
}
