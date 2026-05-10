import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all appointments (Admin only)
router.get('/', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { user: { select: { name: true, email: true } } }
    });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
});

// Submit appointment
router.post('/', async (req, res) => {
  const { userId, date, purpose } = req.body;
  try {
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        date: new Date(date),
        purpose,
        status: 'PENDING'
      }
    });
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'APPOINTMENT_REQUESTED',
        details: `Appointment requested for ${new Date(date).toLocaleDateString()}`
      }
    });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to book appointment' });
  }
});

// Update appointment status (Admin only)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    await prisma.activityLog.create({
      data: {
        action: 'APPOINTMENT_UPDATED',
        details: `Appointment #${id} status changed to ${status}`
      }
    });
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update appointment' });
  }
});

export default router;
