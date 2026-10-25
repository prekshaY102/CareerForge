import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../api/applications';
import { getResumes } from '../api/resumes';

const STATUS_LABELS = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  TECHNICAL_ROUND: 'Technical round',
  HR_ROUND: 'HR round',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};
const STATUSES = Object.keys(STATUS_LABELS);

const FIELDS = [
  { name: 'company', label: 'Company', required: true },
  { name: 'jobTitle', label: 'Job title', required: true },
  { name: 'jobUrl', label: 'Job URL' },
  { name: 'location', label: 'Location' },
  { name: 'jobType', label: 'Job type' },
  { name: 'salary', label: 'Salary' },
  { name: 'applicationDate', label: 'Applied on', type: 'date' },
  { name: 'interviewDate', label: 'Interview date', type: 'date' },
  { name: 'followUpDate', label: 'Follow-up date', type: 'date' },
];

const emptyForm = Object.fromEntries([
  ...FIELDS.map((f) => [f.name, '']),
  ['status', 'SAVED'],
  ['resumeId', ''],
  ['notes', ''],
]);

const formatDate = (d) => new Date(d).toLocaleDateString();

function statusStyle(status) {
  if (status === 'OFFER') return 'text-forge border-forge';
  if (status === 'REJECTED' || status === 'WITHDRAWN') return 'text-muted border-line';
  if (['INTERVIEW', 'TECHNICAL_ROUND', 'HR_ROUND'].includes(status)) return 'text-ember border-ember';
  return 'text-ink border-line';
}

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    Promise.all([getApplications(), getResumes()])
      .then(([apps, resumeList]) => {
        setApplications(apps);
        setResumes(resumeList);
      })
      .catch(() => setError('Could not load applications'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ''));
      const created = await createApplication(payload);
      setApplications((prev) => [created, ...prev]);
      setForm(emptyForm);
      setAdding(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save application');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id, status) {
    setError('');
    try {
      const updated = await updateApplication(id, { status });
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update status');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this application?')) return;
    setError('');
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete application');
    }
  }

  const visible = filter ? applications.filter((a) => a.status === filter) : applications;

  if (loading) return <Layout><p className="text-muted">Loading applications...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-ink">Applications</h1>
          <div className="flex items-center gap-4">
            <select
              value={filter} onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-line rounded-sm px-2 py-1.5 bg-white text-ink"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            {!adding && (
              <button onClick={() => setAdding(true)} className="text-sm text-forge font-medium">+ Add application</button>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

        {adding && (
          <form onSubmit={handleAdd} className="border border-line rounded-sm p-6 bg-white mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FIELDS.map((f) => (
                <div key={f.name}>
                  <label className="block text-xs text-muted mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'} value={form[f.name]} required={f.required}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-forge"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-muted mb-1">Status</label>
                <select
                  value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:border-forge"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Resume used</label>
                <select
                  value={form.resumeId} onChange={(e) => setForm({ ...form, resumeId: e.target.value })}
                  className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:border-forge"
                >
                  <option value="">None</option>
                  {resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-muted mb-1">Notes</label>
              <textarea
                rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-forge"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit" disabled={saving}
                className="bg-ink text-paper rounded-sm px-4 py-2 text-sm font-medium hover:bg-forge transition-colors"
              >
                {saving ? 'Saving...' : 'Save application'}
              </button>
              <button type="button" onClick={() => setAdding(false)} className="text-sm text-muted">Cancel</button>
            </div>
          </form>
        )}

        {visible.length === 0 && (
          <p className="text-sm text-muted">
            {applications.length === 0
              ? 'No applications yet. Add the first one to start tracking your pipeline.'
              : 'No applications with this status.'}
          </p>
        )}

        <ul className="space-y-3">
          {visible.map((a) => {
            const dates = [
              a.applicationDate && `Applied ${formatDate(a.applicationDate)}`,
              a.interviewDate && `Interview ${formatDate(a.interviewDate)}`,
              a.followUpDate && `Follow up ${formatDate(a.followUpDate)}`,
            ].filter(Boolean);
            const details = [a.location, a.jobType, a.salary].filter(Boolean);
            const resumeTitle = resumes.find((r) => r.id === a.resumeId)?.title;

            return (
              <li key={a.id} className="border border-line rounded-sm bg-white p-4 flex justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-ink font-medium">
                    {a.jobTitle} <span className="text-muted font-normal">at {a.company}</span>
                  </p>
                  {details.length > 0 && <p className="text-sm text-muted">{details.join(', ')}</p>}
                  {dates.length > 0 && <p className="text-xs text-muted mt-1">{dates.join(', ')}</p>}
                  {resumeTitle && <p className="text-xs text-muted mt-1">Resume: {resumeTitle}</p>}
                  {a.notes && <p className="text-sm text-ink mt-2">{a.notes}</p>}
                  {a.jobUrl && (
                    <a href={a.jobUrl} target="_blank" rel="noreferrer" className="text-sm text-forge mt-2 inline-block">
                      View posting
                    </a>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <select
                    value={a.status} onChange={(e) => handleStatusChange(a.id, e.target.value)}
                    className={`text-xs border rounded-sm px-2 py-1 bg-white ${statusStyle(a.status)}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <button onClick={() => handleDelete(a.id)} className="text-xs text-muted hover:text-red-700">Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
}