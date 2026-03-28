export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key Error." });

  const userText = messages[messages.length - 1].content;
  
  // We "lead" the AI by starting the sentence for it
  const prompt = `Context: The Crown Cut Barbershop. Prices: Haircut $45, Shave $55, Beard Trim $35.
  User Question: ${userText}
  Assistant: Of course! At The Crown Cut, `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.8, // Higher temperature helps avoid "empty" responses
          maxOutputTokens: 100 
        },
        // This stops the "silent blocking" of barbershop terms
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      const aiText = data.candidates.content.parts.text;
      // We combine our lead-in with the AI's answer
      res.status(200).json({ reply: "Of course! At The Crown Cut, " + aiText });
    } else {
      // This helps us see if it's a SAFETY or RECITATION block
      const reason = data.candidates?.?.finishReason || "API_SILENCE";
      res.status(200).json({ reply: `The AI is being shy (Reason: ${reason}). Try asking 'What are your prices?'` });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection lost. Please refresh the page!" });
  }
}
