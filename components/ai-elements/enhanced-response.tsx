"use client";

import { useState, memo } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Response as OriginalResponse } from "@/components/ai-elements/response";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ResponseProps = React.ComponentProps<typeof OriginalResponse>;

export const EnhancedResponse = memo(
  ({ className, children, ...props }: ResponseProps) => {
    const [copied, setCopied] = useState(false);
    
    // Extract text content for copy functionality
    const extractTextContent = (node: React.ReactNode): string => {
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      if (node === null || node === undefined) return "";
      if (Array.isArray(node)) return node.map(extractTextContent).join("");
      if (typeof node === "object" && "props" in node) {
        return extractTextContent((node as { props?: { children?: React.ReactNode } }).props?.children ?? "");
      }
      return String(node);
    };

    const handleCopy = async () => {
      try {
        const textContent = extractTextContent(children);
        await navigator.clipboard.writeText(textContent);
        setCopied(true);
        toast.success("Response copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy response");
      }
    };

    return (
      <div className="relative group">
        <OriginalResponse className={className} {...props}>
          {children}
        </OriginalResponse>
        
        {/* Copy button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
            "h-8 w-8 p-0"
          )}
          onClick={handleCopy}
          title="Copy response"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  },
  (prevProps: ResponseProps, nextProps: ResponseProps) => prevProps.children === nextProps.children
);

EnhancedResponse.displayName = "EnhancedResponse";