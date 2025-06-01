
export const generateImage = async (prompt: string, apiKey: string): Promise<string> => {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // SDXL model
      input: {
        prompt: prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 20,
        guidance_scale: 7.5,
        prompt_strength: 0.8,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API request failed: ${response.status} ${error}`);
  }

  const prediction = await response.json();
  console.log("Initial prediction:", prediction);

  // Poll for completion
  let result = prediction;
  while (result.status !== "succeeded" && result.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: {
        "Authorization": `Token ${apiKey}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`Status check failed: ${statusResponse.status}`);
    }

    result = await statusResponse.json();
    console.log("Prediction status:", result.status);
  }

  if (result.status === "failed") {
    throw new Error(`Generation failed: ${result.error || "Unknown error"}`);
  }

  if (!result.output || !result.output[0]) {
    throw new Error("No image generated");
  }

  return result.output[0];
};
