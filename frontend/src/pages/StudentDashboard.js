import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import NavBar from '../components/NavBar';
import { Badge, Btn, Card, StatCard, Section, Spinner, TableWrap, TR, TD } from '../components/UI';

const StudentDashboard = () => {
  const [tab, setTab] = useState('Dashboard');
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitErr, setSubmitErr] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profRes, compRes, maintRes] = await Promise.all([
        API.get('/students/me'),
        API.get('/complaints'),
        API.get('/maintenance'),
      ]);
      setProfile(profRes.data.student);
      setComplaints(compRes.data.complaints);
      setMaintenance(maintRes.data.tasks);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async () => {
    if (!desc.trim()) { setSubmitErr('Please describe the issue.'); return; }
    setSubmitErr('');
    try {
      const res = await API.post('/complaints', { description: desc });
      setComplaints(p => [res.data.complaint, ...p]);
      setDesc('');
      setSubmitMsg('Complaint submitted successfully!');
      setTimeout(() => setSubmitMsg(''), 3000);
    } catch (err) {
      setSubmitErr(err.response?.data?.message || 'Submission failed.');
    }
  };

  const getMaint = (complaintId) =>
    maintenance.find(m => m.complaintId?._id === complaintId || m.complaintId === complaintId);

  if (loading) return <><NavBar tabs={[]} activeTab="" setActiveTab={() => {}} /><Spinner /></>;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      <NavBar
        tabs={['Dashboard', 'Submit Complaint', 'Track Status']}
        activeTab={tab} setActiveTab={setTab}
      />

      {/* ── Dashboard ── */}
      {tab === 'Dashboard' && (
        <Section title="Student Dashboard">
          <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
            <StatCard label="Total Complaints" value={complaints.length} />
            <StatCard label="Open" value={complaints.filter(c => c.status === 'Open').length} color="#d97706" />
            <StatCard label="In Progress" value={complaints.filter(c => c.status === 'In Progress').length} color="#2563eb" />
            <StatCard label="Resolved" value={complaints.filter(c => c.status === 'Resolved').length} color="#059669" />
          </div>

          {profile && (
            <Card style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 16,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>📋</span>
                My Room Information
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
                fontSize: 14,
              }}>
                <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 2 }}>Name</span>
                  <span style={{ fontWeight: 500 }}>{profile.name}</span>
                </div>
                <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 2 }}>Room No</span>
                  <strong>{profile.roomNumber}</strong>
                </div>
                <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 2 }}>Contact</span>
                  <span style={{ fontWeight: 500 }}>{profile.contact || '—'}</span>
                </div>
                <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 2 }}>Joined</span>
                  <span style={{ fontWeight: 500 }}>{new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <div style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 16,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>📝</span>
              Recent Complaints
            </div>
            {complaints.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: 14 }}>No complaints yet.</p>
            ) : complaints.slice(0, 3).map(c => (
              <div key={c._id} style={{
                borderBottom: '1px solid #f1f5f9',
                padding: '14px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
                transition: 'background 0.15s ease',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, marginBottom: 5, color: '#334155', lineHeight: 1.5 }}>
                    {c.description.slice(0, 75)}{c.description.length > 75 ? '...' : ''}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    {new Date(c.createdAt).toLocaleDateString()} · Room {c.roomNumber}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <Badge status={c.status} />
                  {c.priority && <Badge status={c.priority} />}
                </div>
              </div>
            ))}
          </Card>
        </Section>
      )}

      {/* ── Submit Complaint ── */}
      {tab === 'Submit Complaint' && (
        <Section title="Submit Complaint">
          <Card style={{ maxWidth: 580 }}>
            <div style={{
              fontSize: 14,
              color: '#64748b',
              marginBottom: 20,
              padding: '10px 14px',
              background: '#f8fafc',
              borderRadius: 8,
              display: 'inline-block',
            }}>
              Room: <strong style={{ color: '#1e293b' }}>{profile?.roomNumber || '—'}</strong>
            </div>
            <label style={{
              fontSize: 13,
              color: '#475569',
              display: 'block',
              marginBottom: 8,
              fontWeight: 500,
            }}>
              Complaint Description *
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe your issue (electricity, plumbing, internet, room maintenance...)"
              rows={5}
              style={{
                width: '100%',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: 14,
                padding: '12px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                background: '#fff',
                color: '#1e293b',
                lineHeight: 1.6,
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#1B4F72';
                e.target.style.boxShadow = '0 0 0 3px rgba(27,79,114,0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {submitErr && <p className="error">{submitErr}</p>}
            {submitMsg && <p className="success">{submitMsg}</p>}
            <div style={{ marginTop: 18 }}>
              <Btn onClick={handleSubmit}>Submit Complaint</Btn>
            </div>
          </Card>
        </Section>
      )}

      {/* ── Track Status ── */}
      {tab === 'Track Status' && (
        <Section title="Track Complaint Status">
          {complaints.length === 0 ? (
            <Card><p style={{ color: '#64748b', fontSize: 14 }}>No complaints found.</p></Card>
          ) : complaints.map(c => {
            const m = getMaint(c._id);
            return (
              <Card key={c._id} style={{ marginBottom: 16 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                  flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 6,
                      color: '#1e293b',
                      lineHeight: 1.5,
                    }}>{c.description}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      Submitted: {new Date(c.createdAt).toLocaleDateString()} · Room {c.roomNumber}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <Badge status={c.status} />
                    {c.priority && <Badge status={c.priority} />}
                  </div>
                </div>
                {m && (
                  <div style={{
                    marginTop: 14,
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: 8,
                    fontSize: 13,
                    borderLeft: '3px solid #2563eb',
                  }}>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: '#64748b' }}>Assigned to: </span>
                      <span style={{ fontWeight: 500, color: '#1e293b' }}>{m.staffId?.name || 'Staff'}</span>
                    </div>
                    {m.scheduledDate && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ color: '#64748b' }}>Scheduled: </span>
                        <span style={{ fontWeight: 500 }}>{new Date(m.scheduledDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {m.notes && <div><span style={{ color: '#64748b' }}>Notes: </span>{m.notes}</div>}
                  </div>
                )}
                {!m && c.status === 'Open' && (
                  <div style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: '#94a3b8',
                    fontStyle: 'italic',
                  }}>
                    Awaiting warden assignment.
                  </div>
                )}
              </Card>
            );
          })}
        </Section>
      )}
    </div>
  );
};

export default StudentDashboard;
