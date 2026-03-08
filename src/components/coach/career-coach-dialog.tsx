"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Loader2, Bot, User } from "lucide-react";

interface CareerCoachDialogProps {
  careerTitle: string;
  careerSlug: string;
  salary: string;
  growthRate: string;
  state?: string;
}

const SUGGESTED_QUESTIONS = [
  "Is this career growing?",
  "What subjects do I need?",
  "TAFE vs University?",
];

export function CareerCoachDialog({
  careerTitle,
  careerSlug,
  salary,
  growthRate,
  state,
}: CareerCoachDialogProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "career",
          message: userMessage,
          slug: careerSlug,
          state,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get response");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return updated;
        });
        scrollToBottom();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setMessages((prev) => prev.filter((m) => m.content !== ""));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <MessageCircle className="h-4 w-4" />
        Ask AI Coach
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Career Coach
          </DialogTitle>
          <DialogDescription className="sr-only">
            Ask questions about this career
          </DialogDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary">{careerTitle}</Badge>
            <Badge variant="outline">{salary}</Badge>
            <Badge variant="outline" className="text-emerald-600">
              {growthRate}
            </Badge>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[400px] pr-1"
        >
          {messages.length === 0 && (
            <div className="text-center py-6">
              <Bot className="h-10 w-10 text-card-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-card-foreground/70 mb-4">
                Ask me anything about becoming a {careerTitle}!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-card-foreground"
                }`}
              >
                {msg.content || (loading && i === messages.length - 1 && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ))}
              </div>
              {msg.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-xs text-destructive text-center">{error}</p>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 pt-2 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${careerTitle}...`}
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
