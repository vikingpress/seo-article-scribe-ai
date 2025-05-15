
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ apiKey, onChange }: ApiKeyInputProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="api-key" className="text-sm font-medium text-primary">
        API Key de OpenAI <span className="text-destructive">*</span>
      </Label>
      <div className="flex">
        <div className="relative flex-1">
          <Input
            id="api-key"
            type={showApiKey ? "text" : "password"}
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => onChange(e.target.value)}
            className="pr-10 bg-muted border-muted"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showApiKey ? "Ocultar API key" : "Mostrar API key"}
            </span>
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Tu API key se almacena localmente en tu navegador y nunca se comparte
      </p>
    </div>
  );
}
