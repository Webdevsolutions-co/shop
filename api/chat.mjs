export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "Key Error." });

  const userText = messages[messages.length - 1].content;
  
  // We add a "Prefix" to the prompt that tricks the AI into starting its answer
  const prompt = `Context: The Crown Cut Barbershop. Prices: Haircut $45, Shave $55, Beard Trim $35.
  Answer the following question professionally in one short sentence. 
  Question: ${userText}
  Assistant: The Crown Cut is happy to help! `;

  try {
    // Switching to the standard 'gemini-3-flash' which has better stability today
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7, // Slightly higher to prevent "boring" empty stops
          maxOutputTokens: 200
        },
        // Forcing all safety filters off to stop the silent blocking
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content && data.candidates.content.parts) {
      const aiResponse = data.candidates.content.parts.text;
      // We combine our prefix with the AI's response for a perfect answer
      res.status(200).json({ reply: "The Crown Cut is happy to help! " + aiResponse });
    } else {
      // Show the reason for the silence so we can fix it
      const reason = data.candidates?.?.finishReason || "UNKNOWN";
      res.status(200).json({ reply: `Service busy (Reason: ${reason}). Please try again in 5 seconds.` });
    }
  } catch (error) {
    res.status(500).json({ reply: "Shop's busy! Try refreshing the page." });
  }
}
