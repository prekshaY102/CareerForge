import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDashboard } from '../api/dashboard';

const STATUS_ORDER = ['SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'TECHNICAL_ROUND', 'HR_ROUND', 'OFFER', 'REJECTED', 'WITHDRAWN'];

const formatStatus = (s) =>
  ({ HR_ROUND: 'HR round', TECHNICAL_ROUND: 'Technical round' }[s] || s.charAt(0) + s.slice(1).toLowerCase());

function Stat({ label, value }) {
  return (
    <div className="border border-line rounded-sm bg-white p-4">
      <p className="text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

function BarRow({ label, value, max, tone = 'bg-forge' }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 shrink-0 text-ink truncate">{label}</span>
      <div className="flex-1 h-2 bg-line rounded-sm">
        <div className={`h-2 rounded-sm ${tone}`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
      <span className="w-6 text-right text-muted">{value}</span>
    </div>
  );
}

function Section({ title, hint, children }) {
  return (
    <section className="border border-line rounded-sm bg-white p-5">
      <h2 className="font-semibold text-ink mb-1">{title}</h2>
      <p className="text-xs text-muted mb-4">{hint}</p>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError('Could not load your dashboard'));
  }, []);

  if (error) return <Layout><p className="text-sm text-red-700">{error}</p></Layout>;
  if (!data) return <Layout><p className="text-muted">Loading dashboard...</p></Layout>;

  const pipeline = STATUS_ORDER.filter((s) => data.pipelineByStatus[s]).map((s) => [s, data.pipelineByStatus[s]]);
  const pipelineMax = Math.max(0, ...pipeline.map(([, count]) => count));
  const skillMax = Math.max(0, ...data.topRequestedSkills.map((s) => s.count));
  const weeks = data.applicationActivityOverTime.slice(-12);
  const weekMax = Math.max(0, ...weeks.map((w) => w.count));

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold text-ink mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <Stat label="Applications sent" value={data.applicationsSent} />
          <Stat label="In interview stages" value={data.interviews} />
          <Stat label="Offers" value={data.offers} />
          <Stat label="Rejections" value={data.rejections} />
          <Stat label="Offer rate" value={`${data.conversionRate}%`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Pipeline" hint="Where each application stands right now.">
            {pipeline.length === 0 ? (
              <p className="text-sm text-muted">
                No applications yet. <Link to="/applications" className="text-forge">Add one</Link> to see your pipeline.
              </p>
            ) : (
              <div className="space-y-3">
                {pipeline.map(([status, count]) => (
                  <BarRow key={status} label={formatStatus(status)} value={count} max={pipelineMax} />
                ))}
              </div>
            )}
          </Section>

          <Section title="Most requested skills" hint="Required skills across the job descriptions you've saved.">
            {data.topRequestedSkills.length === 0 ? (
              <p className="text-sm text-muted">
                <Link to="/job-descriptions" className="text-forge">Save a job description</Link> to see which skills come up most.
              </p>
            ) : (
              <div className="space-y-3">
                {data.topRequestedSkills.map((s) => (
                  <BarRow key={s.skill} label={s.skill} value={s.count} max={skillMax} tone="bg-ember" />
                ))}
              </div>
            )}
          </Section>

          <Section
            title="Skill gaps"
            hint="Requested in your saved job descriptions but missing from your profile. Compared by name, so spellings like React and React.js can show up here."
          >
            {data.skillGaps.length === 0 ? (
              <p className="text-sm text-muted">
                {data.topRequestedSkills.length === 0
                  ? 'Save a job description to compare it against your profile.'
                  : 'No gaps found. Your profile covers every skill in your saved job descriptions.'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.skillGaps.map((skill) => (
                  <span key={skill} className="text-xs border border-ember text-ember rounded-sm px-2 py-1">{skill}</span>
                ))}
              </div>
            )}
          </Section>

          <Section title="Application activity" hint="Applications added per week, last 12 weeks.">
            {weeks.length === 0 ? (
              <p className="text-sm text-muted">Applications you add will show up here week by week.</p>
            ) : (
              <div className="flex items-end gap-2">
                {weeks.map((w) => (
                  <div key={w.week} className="flex-1 text-center">
                    <div className="h-24 flex items-end">
                      <div
                        className="w-full bg-forge rounded-sm"
                        style={{ height: `${weekMax ? (w.count / weekMax) * 100 : 0}%`, minHeight: w.count ? '4px' : 0 }}
                      />
                    </div>
                    <p className="text-xs text-ink mt-1">{w.count}</p>
                    <p className="text-[10px] text-muted">{w.week.slice(5)}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </Layout>
  );
}