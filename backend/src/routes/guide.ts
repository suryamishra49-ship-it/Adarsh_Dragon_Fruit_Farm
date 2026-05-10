import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all guide steps
router.get('/steps', async (req, res) => {
  // We're keeping steps static for simplicity, but we could fetch progress
  // from the database if we passed a userId.
  res.json({
    steps: [
      { id: 1, title: 'Soil Preparation', description: 'Prepare sandy loam soil with good drainage.' },
      { id: 2, title: 'Planting', description: 'Plant cuttings in well-draining soil, supported by a trellis.' },
      { id: 3, title: 'Trellising', description: 'Construct a sturdy trellis to support the growing cactus.' },
      { id: 4, title: 'Pruning', description: 'Prune regularly to encourage branching and fruit production.' },
      { id: 5, title: 'Pollination', description: 'Hand-pollinate flowers if natural pollinators are scarce.' },
      { id: 6, title: 'Harvesting', description: 'Harvest when fruit color changes fully and wings start to wither.' },
    ]
  });
});

// Update progress for a user (mock user 1 for now)
router.post('/progress/:stepId', async (req, res) => {
  try {
    const stepId = parseInt(req.params.stepId);
    const { status } = req.body;
    
    // In a real app, userId comes from auth token
    const userId = 1; 

    const progress = await prisma.guideProgress.upsert({
      where: {
        userId_stepId: {
          userId,
          stepId
        }
      },
      update: { status },
      create: {
        userId,
        stepId,
        status
      }
    });

    res.json({ success: true, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update progress' });
  }
});

// Get user progress
router.get('/progress', async (req, res) => {
  try {
    const userId = 1; // mock user
    const progress = await prisma.guideProgress.findMany({
      where: { userId }
    });
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

export default router;
