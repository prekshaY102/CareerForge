const prisma = require('../config/prisma');

async function getDashboard(req, res) {
  try {
    const userId = req.user.userId;

    const applications = await prisma.jobApplication.findMany({ where: { userId } });
    const jobDescriptions = await prisma.jobDescription.findMany({ where: { userId } });
    const profile = await prisma.profile.findUnique({ where: { userId } });

    const applicationsSent = applications.filter(a => a.status !== 'SAVED').length;
    const interviews = applications.filter(a => ['INTERVIEW', 'TECHNICAL_ROUND', 'HR_ROUND'].includes(a.status)).length;
    const offers = applications.filter(a => a.status === 'OFFER').length;
    const rejections = applications.filter(a => a.status === 'REJECTED').length;
    const conversionRate = applicationsSent > 0 ? Math.round((offers / applicationsSent) * 100) : 0;

    const pipelineByStatus = {};
    applications.forEach(a => { pipelineByStatus[a.status] = (pipelineByStatus[a.status] || 0) + 1; });

    const skillFrequency = {};
    jobDescriptions.forEach(jd => {
      jd.requiredSkills.forEach(skill => { skillFrequency[skill] = (skillFrequency[skill] || 0) + 1; });
    });
    const topRequestedSkills = Object.entries(skillFrequency)
      .sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    const profileSkills = new Set((profile?.skills || []).map(s => s.toLowerCase()));
    const skillGaps = Object.keys(skillFrequency)
      .filter(skill => !profileSkills.has(skill.toLowerCase()))
      .sort((a, b) => skillFrequency[b] - skillFrequency[a])
      .slice(0, 10);

    const activityByWeek = {};
    applications.forEach(a => {
      const weekStart = new Date(a.createdAt);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split('T')[0];
      activityByWeek[key] = (activityByWeek[key] || 0) + 1;
    });
    const applicationActivityOverTime = Object.entries(activityByWeek)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, count]) => ({ week, count }));

    res.json({ applicationsSent, interviews, offers, rejections, conversionRate, pipelineByStatus, topRequestedSkills, skillGaps, applicationActivityOverTime });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Something went wrong building the dashboard' });
  }
}

module.exports = { getDashboard };