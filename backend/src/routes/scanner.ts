import { Router } from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return a mock response if no API key is provided so UI can still be tested
      return res.json({
        success: true,
        diagnosis: '[MOCK] No major diseases detected. The plant appears healthy.',
        confidence: 0.95,
        recommendations: ['Provide Gemini API Key in backend/.env', 'Ensure adequate sunlight']
      });
    }

    // Convert multer buffer to base64 for Gemini
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `You are an expert plant pathologist specializing in Dragon Fruit (Pitaya) farming. 
Analyze this image of a dragon fruit plant/fruit. 
1. Identify any visible diseases or pests.
2. If healthy, state it is healthy.
3. Provide a confidence score between 0.0 and 1.0.
4. Provide up to 3 short recommendations for treatment or care.
Return the response strictly as a JSON object with this exact structure:
{
  "diagnosis": "Short description of the disease or health status",
  "confidence": 0.95,
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    let resultText = response.text || "{}";
    
    // Clean up markdown formatting if Gemini wrapped it in ```json
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedResult = JSON.parse(resultText);
      res.json({
        success: true,
        ...parsedResult
      });
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', resultText);
      res.status(500).json({ success: false, error: 'Failed to parse AI response' });
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze image' });
  }
});

export default router;
