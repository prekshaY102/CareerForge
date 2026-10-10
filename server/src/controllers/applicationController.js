const prisma = require('../config/prisma');

const VALID_STATUSES = ['SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'TECHNICAL_ROUND', 'HR_ROUND', 'OFFER', 'REJECTED', 'WITHDRAWN'];

async function createApplication(req, res) {
  try {
    const { company, jobTitle, jobUrl, location, jobType, salary, applicationDate, status, notes, interviewDate, followUpDate, resumeId } = req.body;

    if (!company || !jobTitle) {
      return res.status(400).json({ error: 'company and jobTitle are required' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const application = await prisma.jobApplication.create({
      data: {
        company, jobTitle, jobUrl, location, jobType, salary,
        applicationDate: applicationDate ? new Date(applicationDate) : null,
        status: status || 'SAVED',
        notes,
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        resumeId: resumeId || null,
        userId: req.user.userId,
      },
    });
    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Something went wrong creating the application' });
  }
}

async function getApplications(req, res) {
  try {
    const { status } = req.query;
    const where = { userId: req.user.userId };
    if (status) where.status = status;

    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { resume: { select: { id: true, title: true } } },
    });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Something went wrong fetching applications' });
  }
}

async function getApplication(req, res) {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
      include: { resume: { select: { id: true, title: true } } },
    });
    if (!application || application.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Something went wrong fetching the application' });
  }
}

async function updateApplication(req, res) {
  try {
    const existing = await prisma.jobApplication.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { company, jobTitle, jobUrl, location, jobType, salary, applicationDate, status, notes, interviewDate, followUpDate, resumeId } = req.body;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const updated = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: {
        company, jobTitle, jobUrl, location, jobType, salary,
        applicationDate: applicationDate ? new Date(applicationDate) : undefined,
        status,
        notes,
        interviewDate: interviewDate ? new Date(interviewDate) : undefined,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        resumeId,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Something went wrong updating the application' });
  }
}

async function deleteApplication(req, res) {
  try {
    const existing = await prisma.jobApplication.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Application not found' });
    }
    await prisma.jobApplication.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Something went wrong deleting the application' });
  }
}

module.exports = { createApplication, getApplications, getApplication, updateApplication, deleteApplication };