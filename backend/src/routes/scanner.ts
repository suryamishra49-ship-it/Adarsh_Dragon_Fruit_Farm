import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Mock disease scanner responses (no external AI API required)
const mockResponses = [
  {
    diagnosis: 'Healthy Plant — No diseases detected.',
    confidence: 0.94,
    recommendations: [
      'Maintain regular watering schedule (2–3 times per week).',
      'Ensure at least 6 hours of direct sunlight daily.',
      'Apply balanced fertilizer every 4–6 weeks during growing season.'
    ]
  },
  {
    diagnosis: 'Early signs of Anthracnose (Colletotrichum gloeosporioides) detected.',
    confidence: 0.87,
    recommendations: [
      'Apply copper-based fungicide every 7–10 days until symptoms clear.',
      'Remove and destroy infected stems to prevent spread.',
      'Improve air circulation by pruning overcrowded branches.'
    ]
  },
  {
    diagnosis: 'Possible Stem Rot (Dothiorella sp.) observed at base.',
    confidence: 0.82,
    recommendations: [
      'Reduce watering frequency — avoid waterlogging around the roots.',
      'Apply mancozeb or carbendazim fungicide to the affected area.',
      'Ensure good drainage by adding sand or perlite to the soil mix.'
    ]
  }
];

router.post('/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image uploaded' });
  }

  // Return a deterministic mock based on file size (for demo variety)
  const mockIndex = req.file.size % mockResponses.length;
  const mock = mockResponses[mockIndex];

  // Simulate slight processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  res.json({ success: true, ...mock });
});

export default router;
