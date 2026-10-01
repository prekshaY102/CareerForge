const prisma = require('../config/prisma');

async function getProfileId(userId) {
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {},
    create: { userId, skills: [] },
  });
  return profile.id;
}

async function addEducation(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const { institution, degree, fieldOfStudy, startDate, endDate, description } = req.body;

  if (!institution || !degree || !startDate) {
    return res.status(400).json({ error: 'institution, degree, and startDate are required' });
  }

  const education = await prisma.education.create({
    data: { institution, degree, fieldOfStudy, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, description, profileId },
  });
  res.status(201).json(education);
}

async function updateEducation(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const existing = await prisma.education.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.profileId !== profileId) {
    return res.status(404).json({ error: 'Education entry not found' });
  }

  const { institution, degree, fieldOfStudy, startDate, endDate, description } = req.body;
  const updated = await prisma.education.update({
    where: { id: req.params.id },
    data: { institution, degree, fieldOfStudy, startDate: startDate ? new Date(startDate) : undefined, endDate: endDate ? new Date(endDate) : null, description },
  });
  res.json(updated);
}

async function deleteEducation(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const existing = await prisma.education.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.profileId !== profileId) {
    return res.status(404).json({ error: 'Education entry not found' });
  }

  await prisma.education.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

module.exports = { addEducation, updateEducation, deleteEducation };