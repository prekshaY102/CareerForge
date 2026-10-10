const prisma = require('../config/prisma');
const ai = require('../config/gemini');

async function generateQuestions(req, res) {
  try {
    const { jobDescriptionId } = req.body;
    let jobDescription = null;

    if (jobDescriptionId) {
      jobDescription = await prisma.jobDescription.findUnique({ where: { id: jobDescriptionId } });
      if (!jobDescription || jobDescription.userId !== req.user.userId) {
        return res.status(404).json({ error: 'Job description not found' });
      }
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
      include: { experience: true, projects: true },
    });

    const prompt = `Generate interview preparation questions for this candidate${jobDescription ? ' for the following job' : ''}. Respond with ONLY valid JSON, no markdown formatting, as an array:
[{ "category": "Technical" | "Behavioral" | "HR" | "Project" | "Role-specific", "question": "..." }]
Generate 2 questions per category (10 total).

Candidate skills: ${profile?.skills?.join(', ') || 'not specified'}
Candidate experience: ${profile?.experience?.map(e => `${e.title} at ${e.company}`).join(', ') || 'not specified'}
Candidate projects: ${profile?.projects?.map(p => p.title).join(', ') || 'not specified'}
${jobDescription ? `Target job: ${jobDescription.jobTitle || ''} at ${jobDescription.companyName || ''}\nRequired skills: ${jobDescription.requiredSkills.join(', ')}` : ''}`;

    const response = await ai.models.generateContent({ model: 'gemini-flash-latest', contents: prompt });
    const questions = JSON.parse(response.text.replace(/```json|```/g, '').trim());

    const created = await prisma.$transaction(
      questions.map((q) =>
        prisma.interviewQuestion.create({
          data: { category: q.category, question: q.question, jobDescriptionId: jobDescriptionId || null, userId: req.user.userId },
        })
      )
    );
    res.status(201).json(created);
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ error: 'Something went wrong generating interview questions' });
  }
}

async function submitAnswer(req, res) {
  try {
    const question = await prisma.interviewQuestion.findUnique({ where: { id: req.params.id } });
    if (!question || question.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ error: 'answer is required' });
    }

    const prompt = `Give brief, constructive feedback on this interview answer. Respond with ONLY valid JSON, no markdown formatting:
{ "feedback": "2-3 sentences of specific, actionable feedback" }

Question (${question.category}): ${question.question}
Candidate's answer: ${answer}`;

    const response = await ai.models.generateContent({ model: 'gemini-flash-latest', contents: prompt });
    const { feedback } = JSON.parse(response.text.replace(/```json|```/g, '').trim());

    const updated = await prisma.interviewQuestion.update({
      where: { id: req.params.id },
      data: { userAnswer: answer, aiFeedback: feedback },
    });
    res.json(updated);
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Something went wrong getting feedback' });
  }
}

async function getQuestions(req, res) {
  try {
    const { jobDescriptionId } = req.query;
    const where = { userId: req.user.userId };
    if (jobDescriptionId) where.jobDescriptionId = jobDescriptionId;

    const questions = await prisma.interviewQuestion.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Something went wrong fetching questions' });
  }
}

async function deleteQuestion(req, res) {
  try {
    const question = await prisma.interviewQuestion.findUnique({ where: { id: req.params.id } });
    if (!question || question.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Question not found' });
    }
    await prisma.interviewQuestion.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Something went wrong deleting the question' });
  }
}

module.exports = { generateQuestions, submitAnswer, getQuestions, deleteQuestion };