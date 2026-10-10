import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProfileListSection from '../components/ProfileListSection';
import {
  getProfile, updateProfile,
  addEducation, deleteEducation,
  addExperience, deleteExperience,
  addProject, deleteProject,
  addCertification, deleteCertification,
} from '../api/profile';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio: '', targetRole: '', githubUrl: '', linkedinUrl: '', portfolioUrl: '', skills: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getProfile().then((data) => {
      setProfile(data);
      setForm({
        bio: data.bio || '', targetRole: data.targetRole || '',
        githubUrl: data.githubUrl || '', linkedinUrl: data.linkedinUrl || '', portfolioUrl: data.portfolioUrl || '',
        skills: (data.skills || []).join(', '),
      });
      setLoading(false);
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const updated = await updateProfile({ ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) });
    // the PUT response doesn't include the nested lists, so merge rather than replace
    setProfile({ ...updated, education: profile.education, experience: profile.experience, projects: profile.projects, certifications: profile.certifications });
    setSaving(false);
    setEditing(false);
  }

  if (loading) return <Layout><p className="text-muted">Loading profile...</p></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-ink">Profile</h1>
        {!editing && <button onClick={() => setEditing(true)} className="text-sm text-forge font-medium">Edit</button>}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="border border-line rounded-sm p-6 bg-white max-w-2xl space-y-4 mb-6">
          <div>
            <label className="block text-xs text-muted mb-1">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full border border-line rounded-sm px-3 py-2 text-ink focus:outline-none focus:border-forge" rows={3} />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Target role</label>
            <input value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              className="w-full border border-line rounded-sm px-3 py-2 text-ink focus:outline-none focus:border-forge" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Skills (comma-separated)</label>
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Node.js, PostgreSQL"
              className="w-full border border-line rounded-sm px-3 py-2 text-ink focus:outline-none focus:border-forge" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">GitHub</label>
              <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full border border-line rounded-sm px-3 py-2 text-ink focus:outline-none focus:border-forge" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">LinkedIn</label>
              <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                className="w-full border border-line rounded-sm px-3 py-2 text-ink focus:outline-none focus:border-forge" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Portfolio</label>
              <input value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                className="w-full border border-line rounded-sm px-3 py-2 text-ink focus:outline-none focus:border-forge" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-ink text-paper rounded-sm px-4 py-2 text-sm font-medium hover:bg-forge transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-sm text-muted">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="border border-line rounded-sm p-6 bg-white max-w-2xl mb-6">
          <p className="text-ink mb-4">{profile.bio || <span className="text-muted">No bio yet.</span>}</p>
          {profile.targetRole && <p className="text-sm text-muted mb-3">Targeting: <span className="text-ink">{profile.targetRole}</span></p>}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill) => <span key={skill} className="text-xs border border-line rounded-sm px-2 py-1 text-ink">{skill}</span>)}
            </div>
          )}
          <div className="flex gap-4 text-sm">
            {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-forge">GitHub</a>}
            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-forge">LinkedIn</a>}
            {profile.portfolioUrl && <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="text-forge">Portfolio</a>}
          </div>
        </div>
      )}

      <ProfileListSection
        title="Education"
        items={profile.education || []}
        fields={[
          { name: 'institution', label: 'Institution', required: true },
          { name: 'degree', label: 'Degree', required: true },
          { name: 'fieldOfStudy', label: 'Field of study' },
          { name: 'startDate', label: 'Start date', type: 'date', required: true },
          { name: 'endDate', label: 'End date', type: 'date' },
        ]}
        renderItem={(item) => `${item.degree}${item.fieldOfStudy ? ' in ' + item.fieldOfStudy : ''} — ${item.institution} (${item.startDate?.slice(0, 4)}–${item.endDate ? item.endDate.slice(0, 4) : 'Present'})`}
        onAdd={async (data) => {
          const created = await addEducation(data);
          setProfile((p) => ({ ...p, education: [...p.education, created] }));
        }}
        onDelete={async (id) => {
          await deleteEducation(id);
          setProfile((p) => ({ ...p, education: p.education.filter((e) => e.id !== id) }));
        }}
      />

      <ProfileListSection
        title="Experience"
        items={profile.experience || []}
        fields={[
          { name: 'title', label: 'Title', required: true },
          { name: 'company', label: 'Company', required: true },
          { name: 'startDate', label: 'Start date', type: 'date', required: true },
          { name: 'endDate', label: 'End date', type: 'date' },
        ]}
        renderItem={(item) => `${item.title} at ${item.company} (${item.startDate?.slice(0, 4)}–${item.endDate ? item.endDate.slice(0, 4) : 'Present'})`}
        onAdd={async (data) => {
          const created = await addExperience(data);
          setProfile((p) => ({ ...p, experience: [...p.experience, created] }));
        }}
        onDelete={async (id) => {
          await deleteExperience(id);
          setProfile((p) => ({ ...p, experience: p.experience.filter((e) => e.id !== id) }));
        }}
      />

      <ProfileListSection
        title="Projects"
        items={profile.projects || []}
        fields={[
          { name: 'title', label: 'Title', required: true },
          { name: 'description', label: 'Description' },
          { name: 'techStack', label: 'Tech stack (comma-separated)' },
          { name: 'githubUrl', label: 'GitHub URL' },
        ]}
        renderItem={(item) => `${item.title}${item.description ? ' — ' + item.description : ''}`}
        onAdd={async (data) => {
          const created = await addProject({ ...data, techStack: data.techStack ? data.techStack.split(',').map((s) => s.trim()).filter(Boolean) : [] });
          setProfile((p) => ({ ...p, projects: [...p.projects, created] }));
        }}
        onDelete={async (id) => {
          await deleteProject(id);
          setProfile((p) => ({ ...p, projects: p.projects.filter((pr) => pr.id !== id) }));
        }}
      />

      <ProfileListSection
        title="Certifications"
        items={profile.certifications || []}
        fields={[
          { name: 'name', label: 'Name', required: true },
          { name: 'issuer', label: 'Issuer', required: true },
          { name: 'issueDate', label: 'Issue date', type: 'date', required: true },
          { name: 'credentialUrl', label: 'Credential URL' },
        ]}
        renderItem={(item) => `${item.name} — ${item.issuer} (${item.issueDate?.slice(0, 4)})`}
        onAdd={async (data) => {
          const created = await addCertification(data);
          setProfile((p) => ({ ...p, certifications: [...p.certifications, created] }));
        }}
        onDelete={async (id) => {
          await deleteCertification(id);
          setProfile((p) => ({ ...p, certifications: p.certifications.filter((c) => c.id !== id) }));
        }}
      />
    </Layout>
  );
}