const prisma = require('../config/prisma');

async function getProfile(req, res) {
  const profile = await prisma.profile.upsert({
    where: { userId: req.user.userId },
    update: {},
    create: { userId: req.user.userId, skills: [] },
    include: { education: true, experience: true, projects: true, certifications: true },
  });
  res.json(profile);
}

async function updateProfile(req, res) {
  const { bio, profilePhotoUrl, targetRole, githubUrl, linkedinUrl, portfolioUrl, skills } = req.body;

  const profile = await prisma.profile.upsert({
    where: { userId: req.user.userId },
    update: { bio, profilePhotoUrl, targetRole, githubUrl, linkedinUrl, portfolioUrl, skills },
    create: { userId: req.user.userId, bio, profilePhotoUrl, targetRole, githubUrl, linkedinUrl, portfolioUrl, skills: skills || [] },
  });
  res.json(profile);
}

module.exports = { getProfile, updateProfile };