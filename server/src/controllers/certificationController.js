const prisma = require('../config/prisma');

async function getProfileId(userId) {
  const profile = await prisma.profile.upsert({ where: { userId }, update: {}, create: { userId, skills: [] } });
  return profile.id;
}

async function addCertification(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const { name, issuer, issueDate, credentialUrl } = req.body;

  if (!name || !issuer || !issueDate) {
    return res.status(400).json({ error: 'name, issuer, and issueDate are required' });
  }

  const certification = await prisma.certification.create({
    data: { name, issuer, issueDate: new Date(issueDate), credentialUrl, profileId },
  });
  res.status(201).json(certification);
}

async function updateCertification(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const existing = await prisma.certification.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.profileId !== profileId) {
    return res.status(404).json({ error: 'Certification not found' });
  }

  const { name, issuer, issueDate, credentialUrl } = req.body;
  const updated = await prisma.certification.update({
    where: { id: req.params.id },
    data: { name, issuer, issueDate: issueDate ? new Date(issueDate) : undefined, credentialUrl },
  });
  res.json(updated);
}

async function deleteCertification(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const existing = await prisma.certification.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.profileId !== profileId) {
    return res.status(404).json({ error: 'Certification not found' });
  }

  await prisma.certification.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

module.exports = { addCertification, updateCertification, deleteCertification };