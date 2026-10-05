const prisma = require('../config/prisma');
const ai = require('../config/gemini');
const pdfParse = require('pdf-parse');

async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { title } = req.body;

    const resume = await prisma.resume.create({
      data: { title: title || req.file.originalname, fileUrl: req.file.path, fileName: req.file.originalname, userId: req.user.userId },
    });
    res.status(201).json(resume);
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Something went wrong uploading the resume' });
  }
}

async function getResumes(req, res) {
  try {
    const resumes = await prisma.resume.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' } });
    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Something went wrong fetching resumes' });
  }
}

async function setActiveResume(req, res) {
  try {
    const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
    if (!resume || resume.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    await prisma.resume.updateMany({ where: { userId: req.user.userId }, data: { isActive: false } });
    const updated = await prisma.resume.update({ where: { id: req.params.id }, data: { isActive: true } });
    res.json(updated);
  } catch (error) {
    console.error('Set active resume error:', error);
    res.status(500).json({ error: 'Something went wrong updating the resume' });
  }
}

async function deleteResume(req, res) {
  try {
    const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
    if (!resume || resume.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    await prisma.resume.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Something went wrong deleting the resume' });
  }
}

async function analyzeResume(req, res) {
  try {
    const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
    if (!resume || resume.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const fileResponse = await fetch(resume.fileUrl);
    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());
    const parsed = await pdfParse(fileBuffer);
    const resumeText = parsed.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({ error: 'Could not extract readable text from this file — try a text-based PDF, not a scanned image' });
    }

    const prompt = `You are a resume reviewer. Analyze this resume and respond with ONLY valid JSON, no markdown formatting, in this exact shape:
{
  "overallImpression": "one or two sentence summary",
  "strengths": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "missingElements": ["point 1", "point 2"]
}

Resume text:
${resumeText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });

    const rawText = response.text.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(rawText);

    const updated = await prisma.resume.update({ where: { id: req.params.id }, data: { analysis } });
    res.json(updated);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Something went wrong analyzing the resume — try again' });
  }
}

module.exports = { uploadResume, getResumes, setActiveResume, deleteResume, analyzeResume };