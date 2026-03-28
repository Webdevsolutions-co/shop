export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key is missing." });

  const userText = messages[messages.length - 1].content;
  
  // 2026 Best Practice: Simple, direct instruction combined with user text
  const prompt = `Context: The Crown Cut Barbershop. Prices: Haircut $45, Shave $55, Beard Trim $35.
Question: ${userText}
Instruction: Answer as a helpful barber in one very short sentence.`;

  try {
    // UPDATED: Using the stable 2026 Gemini 3.1 model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 100 // Prevent "Empty Response" bug
        }
      })
    });

    const data = await response.json();

    // Handling the March 2026 response structure
    if (data.candidates && data.candidates.content && data.candidates.content.parts) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } else {
      // If blocked by safety or server load, show the reason
      const reason = data.candidates?.?.finishReason || "SERVER_BUSY";
      res.status(200).json({ reply: `Bot Update Needed: ${reason}. Please ask about prices again.` });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection timed out. Refreshing..." });
  }
}
