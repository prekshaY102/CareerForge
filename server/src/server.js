const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const educationRoutes = require('./routes/educationRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const jobDescriptionRoutes = require('./routes/jobDescriptionRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CareerForge API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/job-descriptions', jobDescriptionRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});