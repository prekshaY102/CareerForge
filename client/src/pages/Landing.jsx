import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { APP_NAME } from '../config';

const stairs = [
  { label: 'Saved', height: 'h-16' },
  { label: 'Applied', height: 'h-28' },
  { label: 'Interview', height: 'h-40' },
  { label: 'Offer', height: 'h-52' },
];

const features = [
  { title: 'Track every application', body: 'See where each one stands, from saved to offer, with interview and follow-up dates in one list.' },
  { title: 'Get feedback on your resume', body: 'Upload a PDF and get AI suggestions on strengths, gaps, and what is missing.' },
  { title: 'Match a job to your profile', body: 'Paste a job description and see which skills line up, which are missing, and which keywords to add.' },
  { title: 'Practice the interview', body: 'Generate questions for a specific role, write your answers, and get feedback on each one.' },
];

export default function Landing() {
  const { token } = useAuth();
  const primaryLink = token ? '/dashboard' : '/register';
  const primaryLabel = token ? 'Open dashboard' : 'Create your account';

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-5 text-sm">
          {token ? (
            <Link to="/dashboard" className="rounded-sm bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-forge">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-muted hover:text-ink">Log in</Link>
              <Link to="/register" className="rounded-sm bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-forge">
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-20 pt-12 md:grid-cols-2 md:pt-20">
          <div>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              Know your next step in every job search.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              {APP_NAME} keeps your applications, resumes, and interview practice in one place, and uses AI to show where you stand and what to do next.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link to={primaryLink} className="rounded-sm bg-ink px-5 py-3 font-medium text-paper transition-colors hover:bg-forge">
                {primaryLabel}
              </Link>
              {!token && <Link to="/login" className="font-medium text-ink hover:text-forge">Log in</Link>}
            </div>
          </div>

          <div aria-hidden="true" className="flex items-end gap-2">
            {stairs.map((step, i) => (
              <div
                key={step.label}
                className={`flex flex-1 items-end rounded-sm border p-3 text-sm font-medium ${step.height} ${
                  i === stairs.length - 1 ? 'border-forge bg-forge text-paper' : 'border-line bg-white text-ink'
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="max-w-xl font-display text-4xl tracking-tight text-ink">
            Everything a job search needs, in one place.
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {features.map((feature, i) => (
              <div key={feature.title} className="border-t border-line pt-5">
                <p className="text-xs font-medium text-forge">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-muted">{feature.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 max-w-2xl text-sm text-muted">
            The AI parts are suggestions, not verdicts. Every result is labeled as AI-generated, and you decide what to act on.
          </p>
        </section>

        <section className="bg-ink">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
            <h2 className="font-display text-3xl text-paper">Start with one application.</h2>
            <Link to={primaryLink} className="rounded-sm bg-forge px-5 py-3 font-medium text-paper hover:opacity-90">
              {primaryLabel}
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted">
        © {new Date().getFullYear()} {APP_NAME}
      </footer>
    </div>
  );
}