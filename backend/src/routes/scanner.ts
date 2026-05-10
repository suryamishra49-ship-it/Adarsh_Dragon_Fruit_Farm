import { Router } from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        diagnosis: '[MOCK] No major diseases detected. The plant appears healthy.',
        confidence: 0.95,
        recommendations: ['Connect Gemini API Key in backend/.env', 'Ensure adequate sunlight']
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert multer buffer to base64 for Gemini
    const imageData = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `You are an expert plant pathologist specializing in Dragon Fruit (Pitaya) farming. 
Analyze this image of a dragon fruit plant/fruit. 
1. Identify any visible diseases or pests (e.g., Anthracnose, Stem Rot, Mealybugs).
2. If healthy, state it is healthy.
3. Provide a confidence score between 0.0 and 1.0.
4. Provide 2-3 short, actionable recommendations for treatment or care.
Return the response STRICTLY as a JSON object with this exact structure:
{
  "diagnosis": "Short description of status",
  "confidence": 0.95,
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    let resultText = response.text();
    
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
      res.status(500).json({ success: false, error: 'AI returned invalid data format' });
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze image with AI' });
  }
});

export default router;
