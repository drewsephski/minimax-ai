"use client";

import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconSend, IconRobot, IconUser } from "@tabler/icons-react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: "/api/chat" });
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <main className="container mx-auto max-w-3xl p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><IconRobot className="size-5" />OpenRouter Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[65vh] pr-4">
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="flex items-start gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>{m.role === "user" ? <IconUser className="size-4" /> : <IconRobot className="size-4" />}</AvatarFallback>
                  </Avatar>
                  <div className="rounded-md bg-muted/40 p-3 text-sm whitespace-pre-wrap">{m.content}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
            <Input value={input} onChange={handleInputChange} placeholder="Ask anything..." disabled={isLoading} />
            <Button type="submit" disabled={isLoading || input.trim().length === 0}><IconSend className="size-4" /></Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
