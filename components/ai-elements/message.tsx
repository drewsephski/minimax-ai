import * as React from "react";

export function Message({ from, children }: { from: "user" | "assistant" | string; children: React.ReactNode }) {
  return (
    <div className="my-4">
      <div className="font-medium mb-2">{from === "user" ? "You" : "Assistant"}</div>
      {children}
    </div>
  );
}

export function MessageContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}
