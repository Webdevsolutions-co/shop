export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key is missing." });

  const userText = messages[messages.length - 1].content;
  
  // Combine rules and question into one block for maximum stability
  const combinedPrompt = `CONTEXT: You are a barber at The Crown Cut. Prices: Haircut $45, Shave $55, Beard Trim $35.
  USER QUESTION: ${userText}
  INSTRUCTION: Answer briefly in one sentence.`;

  try {
    // Using the stable v1 endpoint and the latest 2026 Flash model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: combinedPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048 // Higher value prevents the "None" response bug
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } else {
      // This will tell us the EXACT reason Google is saying no
      const reason = data.candidates?.?.finishReason || "Unknown Error";
      const detail = data.error ? data.error.message : "No text returned";
      res.status(200).json({ reply: `System Block (${reason}): ${detail}` });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection failed: " + error.message });
  }
}
