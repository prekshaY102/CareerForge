import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getResumes, uploadResume, activateResume, analyzeResume, deleteResume } from '../api/resumes';

function AnalysisList({ label, items }) {
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

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getResumes()
      .then(setResumes)
      .catch(() => setError('Could not load resumes'))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    const form = e.target;
    setError('');
    setUploading(true);
    try {
      const created = await uploadResume(file, title);
      setResumes((prev) => [created, ...prev]);
      setFile(null);
      setTitle('');
      form.reset();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleActivate(id) {
    setError('');
    try {
      await activateResume(id);
      setResumes((prev) => prev.map((r) => ({ ...r, isActive: r.id === id })));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update resume');
    }
  }

  async function handleAnalyze(id) {
    setError('');
    setAnalyzingId(id);
    try {
      const updated = await analyzeResume(id);
      setResumes((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this resume?')) return;
    setError('');
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete resume');
    }
  }

  if (loading) return <Layout><p className="text-muted">Loading resumes...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-ink mb-6">Resumes</h1>

        <form onSubmit={handleUpload} className="border border-line rounded-sm p-6 bg-white mb-6">
          <h2 className="font-semibold text-ink mb-4">Upload a resume</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted mb-1">File (PDF, DOC, or DOCX, up to 5 MB)</label>
              <input
                type="file" accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="block w-full text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Title (optional)</label>
              <input
                value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Backend-focused resume"
                className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-forge"
              />
            </div>
          </div>
          <button
            type="submit" disabled={!file || uploading}
            className="mt-4 bg-ink text-paper rounded-sm px-4 py-2 text-sm font-medium hover:bg-forge transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

        {resumes.length === 0 && <p className="text-sm text-muted">No resumes yet. Upload one to get started.</p>}

        <ul className="space-y-4">
          {resumes.map((resume) => {
            const isPdf = resume.fileName?.toLowerCase().endsWith('.pdf');
            return (
              <li key={resume.id} className="border border-line rounded-sm p-5 bg-white">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-ink font-medium">
                      {resume.title}
                      {resume.isActive && (
                        <span className="ml-2 text-xs border border-forge text-forge rounded-sm px-2 py-0.5">Active</span>
                      )}
                    </p>
                    <p className="text-xs text-muted mt-1">{resume.fileName}</p>
                  </div>
                  <a href={resume.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-forge shrink-0">View</a>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  {!resume.isActive && (
                    <button onClick={() => handleActivate(resume.id)} className="text-ink hover:text-forge">Set as active</button>
                  )}
                  {isPdf && (
                    <button
                      onClick={() => handleAnalyze(resume.id)} disabled={analyzingId === resume.id}
                      className="text-ink hover:text-forge disabled:opacity-50"
                    >
                      {analyzingId === resume.id ? 'Analyzing...' : resume.analysis ? 'Re-analyze' : 'Analyze with AI'}
                    </button>
                  )}
                  <button onClick={() => handleDelete(resume.id)} className="text-muted hover:text-red-700">Delete</button>
                </div>

                {!isPdf && <p className="text-xs text-muted mt-2">AI analysis currently supports PDF files only.</p>}

                {resume.analysis && (
                  <div className="mt-4 border-t border-line pt-4 text-sm">
                    <p className="text-xs text-muted mb-3">
                      AI-generated suggestions: a starting point, not a verdict. Check anything that matters before acting on it.
                    </p>
                    <p className="text-ink mb-3">{resume.analysis.overallImpression}</p>
                    <AnalysisList label="Strengths" items={resume.analysis.strengths} />
                    <AnalysisList label="Improvements" items={resume.analysis.improvements} />
                    <AnalysisList label="Missing" items={resume.analysis.missingElements} />
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