import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getQuestions, generateQuestions, submitAnswer, deleteQuestion } from '../api/interview';
import { getJobDescriptions } from '../api/jobDescriptions';

function QuestionCard({ question, jobLabel, onAnswer, onDelete }) {
  const [draft, setDraft] = useState(question.userAnswer || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onAnswer(question.id, draft);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not get feedback');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <li className="border border-line rounded-sm bg-white p-5">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-ink">{question.question}</p>
          {jobLabel && <p className="text-xs text-muted mt-1">Tailored to {jobLabel}</p>}
        </div>
        <button onClick={() => onDelete(question.id)} className="text-xs text-muted hover:text-red-700 shrink-0">
          Remove
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          rows={4} value={draft} onChange={(e) => setDraft(e.target.value)}
          placeholder="Write your answer the way you'd say it in the interview..."
          className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-forge"
        />
        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit" disabled={submitting || !draft.trim()}
            className="bg-ink text-paper rounded-sm px-4 py-2 text-sm font-medium hover:bg-forge transition-colors disabled:opacity-50"
          >
            {submitting ? 'Getting feedback...' : question.aiFeedback ? 'Update feedback' : 'Get feedback'}
          </button>
          {error && <span className="text-sm text-red-700">{error}</span>}
        </div>
      </form>

      {question.aiFeedback && (
        <div className="mt-4 border-t border-line pt-4 text-sm">
          <p className="text-xs text-muted mb-2">AI feedback: a second opinion, not a grade.</p>
          <p className="text-ink">{question.aiFeedback}</p>
        </div>
      )}
    </li>
  );
}

export default function Interview() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState(searchParams.get('jd') || '');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getQuestions(), getJobDescriptions()])
      .then(([questionList, jobList]) => {
        setQuestions(questionList);
        setJobs(jobList);
      })
      .catch(() => setError('Could not load interview prep'))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    setError('');
    setGenerating(true);
    try {
      const created = await generateQuestions(jobId);
      setQuestions((prev) => [...created, ...prev]);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not generate questions');
    } finally {
      setGenerating(false);
    }
  }

  async function handleAnswer(id, answer) {
    const updated = await submitAnswer(id, answer);
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));
  }

  async function handleDelete(id) {
    setError('');
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not remove question');
    }
  }

  const jobLabel = (id) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return null;
    return `${job.jobTitle || 'role'}${job.companyName ? ' at ' + job.companyName : ''}`;
  };

  const groups = questions.reduce((acc, q) => {
    (acc[q.category] ||= []).push(q);
    return acc;
  }, {});

  if (loading) return <Layout><p className="text-muted">Loading interview prep...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold text-ink mb-6">Interview prep</h1>

        <div className="border border-line rounded-sm p-6 bg-white mb-6">
          <label className="block text-xs text-muted mb-1">Tailor questions to</label>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={jobId} onChange={(e) => setJobId(e.target.value)}
              className="border border-line rounded-sm px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:border-forge"
            >
              <option value="">My profile in general</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.jobTitle || 'Untitled role'}{job.companyName ? ` at ${job.companyName}` : ''}
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerate} disabled={generating}
              className="bg-ink text-paper rounded-sm px-4 py-2 text-sm font-medium hover:bg-forge transition-colors disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate questions'}
            </button>
          </div>
          <p className="text-xs text-muted mt-3">
            Ten questions across technical, behavioral, HR, project, and role-specific. AI-generated, so treat them as practice prompts.
          </p>
        </div>

        {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

        {questions.length === 0 && (
          <p className="text-sm text-muted">No questions yet. Generate a set above and practice your answers.</p>
        )}

        {Object.entries(groups).map(([category, items]) => (
          <section key={category} className="mb-8">
            <h2 className="font-semibold text-ink mb-3">{category}</h2>
            <ul className="space-y-4">
              {items.map((q) => (
                <QuestionCard
                  key={q.id} question={q}
                  jobLabel={q.jobDescriptionId ? jobLabel(q.jobDescriptionId) : null}
                  onAnswer={handleAnswer} onDelete={handleDelete}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Layout>
  );
}