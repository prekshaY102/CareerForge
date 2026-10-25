import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  getJobDescriptions,
  createJobDescription,
  deleteJobDescription,
  analyzeMatch,
  getMatchAnalyses,
} from '../api/jobDescriptions';

function TagList({ label, items, tone = 'border-line text-ink' }) {
  if (!items?.length) return null;
  return (
    <div className="mb-3">
      <p className="text-xs text-muted mb-1">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className={`text-xs border rounded-sm px-2 py-1 ${tone}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function BulletList({ label, items }) {
  if (!items?.length) return null;
  return (
    <div className="mb-3">
      <p className="font-medium text-ink mb-1">{label}</p>
      <ul className="list-disc pl-5 text-muted space-y-1">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function JobDescriptions() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rawText, setRawText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [matchingId, setMatchingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [matches, setMatches] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    getJobDescriptions()
      .then(setJobs)
      .catch(() => setError('Could not load job descriptions'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setAnalyzing(true);
    try {
      const created = await createJobDescription(rawText);
      setJobs((prev) => [created, ...prev]);
      setRawText('');
      setExpandedId(created.id);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not analyze this job description');
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleMatch(id) {
    setError('');
    setMatchingId(id);
    try {
      const analysis = await analyzeMatch(id);
      setMatches((prev) => ({ ...prev, [id]: analysis }));
      setExpandedId(id);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not run the match analysis');
    } finally {
      setMatchingId(null);
    }
  }

  async function handleToggle(id) {
    const expanding = expandedId !== id;
    setExpandedId(expanding ? id : null);
    if (expanding && !matches[id]) {
      try {
        const history = await getMatchAnalyses(id);
        if (history.length) setMatches((prev) => ({ ...prev, [id]: history[0] }));
      } catch {
        // no saved analysis is fine, a fresh one can be run
      }
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this job description?')) return;
    setError('');
    try {
      await deleteJobDescription(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete job description');
    }
  }

  if (loading) return <Layout><p className="text-muted">Loading job descriptions...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold text-ink mb-6">Job descriptions</h1>

        <form onSubmit={handleCreate} className="border border-line rounded-sm p-6 bg-white mb-6">
          <label className="block text-xs text-muted mb-1">Paste a job description</label>
          <textarea
            rows={8} value={rawText} onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste the full posting here..."
            className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-forge"
          />
          <button
            type="submit" disabled={analyzing || rawText.trim().length < 50}
            className="mt-3 bg-ink text-paper rounded-sm px-4 py-2 text-sm font-medium hover:bg-forge transition-colors disabled:opacity-50"
          >
            {analyzing ? 'Analyzing...' : 'Extract requirements'}
          </button>
          <p className="text-xs text-muted mt-2">
            AI pulls out skills, responsibilities, and keywords. Check the result against the original posting.
          </p>
        </form>

        {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

        {jobs.length === 0 && (
          <p className="text-sm text-muted">No job descriptions yet. Paste one above to break it down.</p>
        )}

        <ul className="space-y-4">
          {jobs.map((job) => {
            const match = matches[job.id];
            const expanded = expandedId === job.id;
            return (
              <li key={job.id} className="border border-line rounded-sm bg-white p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-ink font-medium">
                      {job.jobTitle || 'Untitled role'}
                      {job.companyName && <span className="text-muted font-normal"> at {job.companyName}</span>}
                    </p>
                    {job.experienceRequired && <p className="text-xs text-muted mt-1">{job.experienceRequired}</p>}
                  </div>
                  <button onClick={() => handleDelete(job.id)} className="text-xs text-muted hover:text-red-700 shrink-0">
                    Delete
                  </button>
                </div>

                <div className="mt-3">
                  <TagList label="Required skills" items={job.requiredSkills} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <button
                    onClick={() => handleMatch(job.id)} disabled={matchingId === job.id}
                    className="text-ink hover:text-forge disabled:opacity-50"
                  >
                    {matchingId === job.id ? 'Comparing...' : match ? 'Re-run match' : 'Match against my profile'}
                  </button>
                  <Link to={`/interview?jd=${job.id}`} className="text-ink hover:text-forge">
                    Practice interview questions
                  </Link>
                  <button onClick={() => handleToggle(job.id)} className="text-muted hover:text-ink">
                    {expanded ? 'Hide details' : 'Show details'}
                  </button>
                </div>

                {expanded && (
                  <div className="mt-4 border-t border-line pt-4 text-sm">
                    <TagList label="Preferred skills" items={job.preferredSkills} />
                    <TagList label="Technologies" items={job.technologies} />
                    <TagList label="Keywords" items={job.keywords} />
                    <BulletList label="Responsibilities" items={job.responsibilities} />
                    {job.educationRequirements && (
                      <p className="text-muted mb-3">
                        <span className="font-medium text-ink">Education: </span>{job.educationRequirements}
                      </p>
                    )}

                    {match && (
                      <div className="mt-4 border-t border-line pt-4">
                        <p className="text-xs text-muted mb-3">
                          AI-generated estimate based on your saved profile. A rough guide, not a verdict, and only as good as the profile behind it.
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-semibold text-ink">{match.overallMatch}%</span>
                          <div className="flex-1 h-2 bg-line rounded-sm">
                            <div
                              className="h-2 rounded-sm bg-forge"
                              style={{ width: `${Math.min(100, Math.max(0, match.overallMatch))}%` }}
                            />
                          </div>
                        </div>
                        <TagList label="Matching skills" items={match.matchingSkills} tone="border-forge text-forge" />
                        <TagList label="Missing skills" items={match.missingSkills} tone="border-ember text-ember" />
                        <TagList label="Missing keywords" items={match.missingKeywords} />
                        <BulletList label="Relevant experience" items={match.relevantExperience} />
                        <BulletList label="Recommended improvements" items={match.recommendedImprovements} />
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
}