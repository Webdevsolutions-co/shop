export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key missing in Vercel." });

  const userText = messages[messages.length - 1].content;
  
  // 2026 Best Practice: Use a 'System Instruction' for the Barber shop
  const systemInstruction = "You are a barber at The Crown Cut. Prices: Haircut $45, Shave $55, Beard Trim $35. Be friendly and very brief.";

  try {
    // UPDATED: Using the March 2026 stable preview
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: {
          temperature: 0.4, // Keep it focused on prices
          maxOutputTokens: 150
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    const data = await response.json();

    // 2026 JSON Check: Handling the new "candidates" array format
    if (data.candidates && data.candidates.content && data.candidates.content.parts) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } else {
      // If Google still fails, we show the actual error so we can kill the bug
      const errorMessage = data.error ? data.error.message : "Google refused to generate text.";
      res.status(200).json({ reply: "System Alert: " + errorMessage });
    }
  } catch (error) {
    res.status(500).json({ reply: "Network Error: " + error.message });
  }
}
