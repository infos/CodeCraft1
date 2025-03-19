import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Emperor } from "@shared/schema";

interface VirtualHistorianProps {
  emperor: Emperor;
}

export default function VirtualHistorian({ emperor }: VirtualHistorianProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const handleAsk = () => {
    // Mock response based on question and emperor context
    const mockResponse = `During ${emperor.name}'s reign (${emperor.startYear}-${emperor.endYear} CE), 
      the empire saw significant developments. ${emperor.achievements}`;
    setResponse(mockResponse);
    setQuestion("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ask the Virtual Historian</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this emperor..."
            className="flex-1"
          />
          <Button onClick={handleAsk}>Ask</Button>
        </div>
        
        {response && (
          <div className="p-4 bg-muted rounded-lg">
            <p>{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
