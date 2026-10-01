const prisma = require('../config/prisma');

async function getProfileId(userId) {
  const profile = await prisma.profile.upsert({ where: { userId }, update: {}, create: { userId, skills: [] } });
  return profile.id;
}

async function addProject(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const { title, description, techStack, link, githubUrl } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const project = await prisma.project.create({
    data: { title, description, techStack: techStack || [], link, githubUrl, profileId },
  });
  res.status(201).json(project);
}

async function updateProject(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.profileId !== profileId) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { title, description, techStack, link, githubUrl } = req.body;
  const updated = await prisma.project.update({
    where: { id: req.params.id },
    data: { title, description, techStack, link, githubUrl },
  });
  res.json(updated);
}

async function deleteProject(req, res) {
  const profileId = await getProfileId(req.user.userId);
  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.profileId !== profileId) {
    return res.status(404).json({ error: 'Project not found' });
  }

  await prisma.project.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

module.exports = { addProject, updateProject, deleteProject };