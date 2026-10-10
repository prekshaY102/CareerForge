const prisma = require('../config/prisma');
const ai = require('../config/gemini');

async function createJobDescription(req, res) {
  try {
    const { rawText } = req.body;
    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({ error: 'rawText is required and should be the full job description' });
    }

    const prompt = `You are analyzing a job description. Extract the following and respond with ONLY valid JSON, no markdown formatting:
{
  "companyName": "string or null",
  "jobTitle": "string or null",
  "requiredSkills": ["..."],
  "preferredSkills": ["..."],
  "experienceRequired": "string or null",
  "responsibilities": ["..."],
  "technologies": ["..."],
  "keywords": ["..."],
  "educationRequirements": "string or null"
}

Job description:
${rawText}`;

    const response = await ai.models.generateContent({ model: 'gemini-flash-latest', contents: prompt });
    const extracted = JSON.parse(response.text.replace(/```json|```/g, '').trim());

    const jobDescription = await prisma.jobDescription.create({
      data: {
        rawText,
        companyName: extracted.companyName || null,
        jobTitle: extracted.jobTitle || null,
        requiredSkills: extracted.requiredSkills || [],
        preferredSkills: extracted.preferredSkills || [],
        experienceRequired: extracted.experienceRequired || null,
        responsibilities: extracted.responsibilities || [],
        technologies: extracted.technologies || [],
        keywords: extracted.keywords || [],
        educationRequirements: extracted.educationRequirements || null,
        userId: req.user.userId,
      },
    });
    res.status(201).json(jobDescription);
  } catch (error) {
    console.error('Create job description error:', error);
    res.status(500).json({ error: 'Something went wrong analyzing the job description' });
  }
}

async function getJobDescriptions(req, res) {
  try {
    const jobDescriptions = await prisma.jobDescription.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' } });
    res.json(jobDescriptions);
  } catch (error) {
    console.error('Get job descriptions error:', error);
    res.status(500).json({ error: 'Something went wrong fetching job descriptions' });
  }
}

async function getJobDescription(req, res) {
  try {
    const jobDescription = await prisma.jobDescription.findUnique({ where: { id: req.params.id } });
    if (!jobDescription || jobDescription.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Job description not found' });
    }
    res.json(jobDescription);
  } catch (error) {
    console.error('Get job description error:', error);
    res.status(500).json({ error: 'Something went wrong fetching the job description' });
  }
}

async function deleteJobDescription(req, res) {
  try {
    const jobDescription = await prisma.jobDescription.findUnique({ where: { id: req.params.id } });
    if (!jobDescription || jobDescription.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Job description not found' });
    }
    await prisma.jobDescription.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete job description error:', error);
    res.status(500).json({ error: 'Something went wrong deleting the job description' });
  }
}

module.exports = { createJobDescription, getJobDescriptions, getJobDescription, deleteJobDescription };