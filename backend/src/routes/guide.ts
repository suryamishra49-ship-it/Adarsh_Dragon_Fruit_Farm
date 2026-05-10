import { Router } from 'express';

const router = Router();

// Get all guide steps
router.get('/steps', (req, res) => {
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

export default router;
