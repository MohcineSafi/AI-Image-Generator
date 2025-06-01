
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ExternalLink, Key } from "lucide-react";
import { toast } from "sonner";

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("replicate_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setIsExpanded(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    
    localStorage.setItem("replicate_api_key", apiKey.trim());
    toast.success("API key saved successfully!");
    setIsExpanded(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem("replicate_api_key");
    setApiKey("");
    toast.success("API key cleared");
    setIsExpanded(true);
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-400" />
          Replicate API Key
          {!isExpanded && apiKey && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="ml-auto text-slate-400 hover:text-slate-200"
            >
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      {isExpanded ? (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="Enter your Replicate API key (r8_...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-400 pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSaveKey}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save Key
              </Button>
              {apiKey && (
                <Button
                  variant="outline"
                  onClick={handleClearKey}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="text-sm text-slate-400 space-y-2">
              <p>
                Need an API key?{" "}
                <a
                  href="https://replicate.com/account/api-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                >
                  Get it from Replicate
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              <p className="text-xs">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>API key configured</span>
            <span className="text-green-400">✓</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ApiKeyInput;
