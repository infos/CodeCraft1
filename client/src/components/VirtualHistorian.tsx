import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Emperor } from "@shared/schema";

interface VirtualHistorianProps {
  emperor: Emperor;
}

interface Message {
  type: "user" | "historian";
  content: string;
}

export default function VirtualHistorian({ emperor }: VirtualHistorianProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user" as const, content: input };
    const historianResponse = {
      type: "historian" as const,
      content: `Based on historical records, during ${emperor.name}'s reign (${emperor.startYear}-${emperor.endYear} CE), ${emperor.description}. Notable achievements include ${emperor.achievements}.`
    };

    setMessages(prev => [...prev, userMessage, historianResponse]);
    setInput("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask the Virtual Historian</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the emperor..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
