
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ApiKeyInput from "./ApiKeyInput";
import GeneratedImage from "./GeneratedImage";
import { generateImage } from "@/utils/replicateApi";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    const apiKey = localStorage.getItem("replicate_api_key");
    
    if (!apiKey) {
      toast.error("Please enter your Replicate API key first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(prompt, apiKey);
      setGeneratedImage(imageUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate image. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ApiKeyInput />
      
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-3">
                Describe the image you want to create
              </label>
              <Textarea
                id="prompt"
                placeholder="A majestic dragon soaring through a starlit sky, digital art, highly detailed..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-purple-500 transition-colors"
                disabled={isGenerating}
              />
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedImage && <GeneratedImage imageUrl={generatedImage} prompt={prompt} />}
    </div>
  );
};

export default ImageGenerator;
