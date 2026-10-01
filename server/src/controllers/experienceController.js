const prisma = require('../config/prisma');

async function getProfileId(userId) {
  const profile = await prisma.profile.upsert({ where: { userId }, update: {}, create: { userId, skills: [] } });
  return profile.id;
}

async function addExperience(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const { company, title, startDate, endDate, current, description } = req.body;

  if (!company || !title || !startDate) {
    return res.status(400).json({ error: 'company, title, and startDate are required' });
  }

  const experience = await prisma.experience.create({
    data: { company, title, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, current: !!current, description, profileId },
  });
  res.status(201).json(experience);
}

async function updateExperience(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const existing = await prisma.experience.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.profileId !== profileId) {
    return res.status(404).json({ error: 'Experience entry not found' });
  }

  const { company, title, startDate, endDate, current, description } = req.body;
  const updated = await prisma.experience.update({
    where: { id: req.params.id },
    data: { company, title, startDate: startDate ? new Date(startDate) : undefined, endDate: endDate ? new Date(endDate) : null, current, description },
  });
  res.json(updated);
}

async function deleteExperience(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const existing = await prisma.experience.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.profileId !== profileId) {
    return res.status(404).json({ error: 'Experience entry not found' });
  }

  await prisma.experience.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

module.exports = { addExperience, updateExperience, deleteExperience };