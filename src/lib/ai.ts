import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function explainCode(code: string): Promise<string> {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Explain what this code does in 2-3 sentences. Be concise and focus on the main purpose.

Code:
\`\`\`typescript
${code}
\`\`\``,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return textContent.text;
    }

    return "Unable to generate explanation.";
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return "Error: Could not analyze code.";
  }
}

// 🎓 LEARNING MOMENT: Token Usage
export async function explainCodeWithTokenCount(code: string) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Explain what this code does in 2-3 sentences.

Code:
\`\`\`typescript
${code}
\`\`\``,
      },
    ],
  });

  console.log("📊 Token Usage:");
  console.log("  Input tokens:", message.usage.input_tokens);
  console.log("  Output tokens:", message.usage.output_tokens);
  console.log("  Total tokens:", message.usage.input_tokens + message.usage.output_tokens);
  
  // Cost calculation (Sonnet 4.5 pricing as of Feb 2025)
  const inputCost = (message.usage.input_tokens / 1_000_000) * 3; // $3 per million
  const outputCost = (message.usage.output_tokens / 1_000_000) * 15; // $15 per million
  console.log("  Estimated cost: $" + (inputCost + outputCost).toFixed(6));

  const textContent = message.content.find((block) => block.type === "text");
  return textContent && textContent.type === "text" ? textContent.text : "";
}