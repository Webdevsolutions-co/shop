export default async function handler(req, res) {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // These are your "Barbershop Rules"
  const systemPrompt = "You are a helpful assistant for a Barbershop. Only answer questions about haircuts, shaves, and pricing. Prices: Cut $30, Shave $20. Be polite.";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: systemPrompt + " User question: " + message }]
        }]
      })
    });

    const data = await response.json();
    const aiResponse = data.candidates.content.parts.text;
    
    res.status(200).json({ text: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong with the AI." });
  }
}
