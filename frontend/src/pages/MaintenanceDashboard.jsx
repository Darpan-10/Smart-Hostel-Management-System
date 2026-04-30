import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import NavBar from '../components/NavBar';
import { Badge, Btn, Card, StatCard, Section, Spinner } from '../components/UI';

const MaintenanceDashboard = () => {
  const [tab, setTab] = useState('Dashboard');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/maintenance');
      setTasks(res.data.tasks);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdate = async (taskId, status, notes = '') => {
    try {
      const res = await API.put(`/maintenance/${taskId}`, { status, notes: notes || undefined });
      setTasks(p => p.map(t => t._id === taskId ? res.data.maintenance : t));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <><NavBar tabs={[]} activeTab="" setActiveTab={() => {}} /><Spinner /></>;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      <NavBar
        tabs={['Dashboard', 'Assigned Issues', 'Schedule']}
        activeTab={tab} setActiveTab={setTab}
      />

      {/* ── Dashboard ── */}
      {tab === 'Dashboard' && (
        <Section title="Maintenance Dashboard">
          <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
            <StatCard label="Total Tasks" value={tasks.length} />
            <StatCard label="In Progress" value={tasks.filter(t => t.status === 'In Progress').length} color="#2563eb" />
            <StatCard label="Resolved" value={tasks.filter(t => t.status === 'Resolved').length} color="#059669" />
          </div>

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
              <span style={{ fontSize: 18 }}>🔧</span>
              Pending Repairs
            </div>
            {tasks.filter(t => t.status === 'In Progress').length === 0 ? (
              <p style={{ color: '#64748b', fontSize: 14 }}>No pending tasks.</p>
            ) : tasks.filter(t => t.status === 'In Progress').map(t => (
              <div key={t._id} style={{
                borderBottom: '1px solid #f1f5f9',
                padding: '14px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, marginBottom: 4, color: '#334155', lineHeight: 1.5 }}>
                    {t.complaintId?.description?.slice(0, 70)}...
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    Room {t.complaintId?.roomNumber}
                    {t.scheduledDate ? ` · Scheduled: ${new Date(t.scheduledDate).toLocaleDateString()}` : ''}
                  </div>
                </div>
                <Btn onClick={() => handleUpdate(t._id, 'Resolved')} small color="#059669">
                  Mark Resolved
                </Btn>
              </div>
            ))}
          </Card>
        </Section>
      )}

      {/* ── Assigned Issues ── */}
      {tab === 'Assigned Issues' && (
        <Section title="View Assigned Issues">
          {tasks.length === 0 ? (
            <Card><p style={{ color: '#64748b', fontSize: 14 }}>No tasks assigned.</p></Card>
          ) : tasks.map(t => (
            <Card key={t._id} style={{ marginBottom: 16 }}>
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
                  }}>
                    {t.complaintId?.description}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                    Room {t.complaintId?.roomNumber}
                    {t.scheduledDate
                      ? ` · Scheduled: ${new Date(t.scheduledDate).toLocaleDateString()}`
                      : ''}
                  </div>
                  {t.notes && (
                    <div style={{
                      fontSize: 13,
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: 6,
                      borderLeft: '3px solid #059669',
                    }}>
                      <span style={{ color: '#64748b' }}>Notes: </span>
                      <span style={{ color: '#334155' }}>{t.notes}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <Badge status={t.status} />
                  {t.status === 'In Progress' && (
                    editingId === t._id ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: 8,
                        animation: 'fadeIn 0.2s ease',
                      }}>
                        <input
                          value={editNotes} onChange={e => setEditNotes(e.target.value)}
                          placeholder="Add repair notes..."
                          style={{ fontSize: 13, padding: '8px 12px', minWidth: 180 }}
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Btn onClick={() => handleUpdate(t._id, 'Resolved', editNotes)}
                            small color="#059669">Resolve</Btn>
                          <Btn onClick={() => setEditingId(null)} small outline>Cancel</Btn>
                        </div>
                      </div>
                    ) : (
                      <Btn onClick={() => { setEditingId(t._id); setEditNotes(t.notes || ''); }} small>
                        Update Progress
                      </Btn>
                    )
                  )}
                </div>
              </div>
            </Card>
          ))}
        </Section>
      )}

      {/* ── Schedule ── */}
      {tab === 'Schedule' && (
        <Section title="Maintenance Schedule">
          {tasks.filter(t => t.scheduledDate).length === 0 ? (
            <Card><p style={{ color: '#64748b', fontSize: 14 }}>No scheduled tasks.</p></Card>
          ) : [...tasks.filter(t => t.scheduledDate)]
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
            .map(t => {
              const sDate = new Date(t.scheduledDate).toISOString().split('T')[0];
              const overdue = sDate < today && t.status !== 'Resolved';
              const borderColor = overdue ? '#dc2626' : t.status === 'Resolved' ? '#059669' : '#2563eb';
              return (
                <Card key={t._id} style={{
                  marginBottom: 14,
                  borderLeft: `4px solid ${borderColor}`,
                  transition: 'box-shadow 0.2s ease',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}>
                    <div>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 5,
                        color: '#1e293b',
                        lineHeight: 1.5,
                      }}>
                        {t.complaintId?.description?.slice(0, 65)}...
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>
                        Room {t.complaintId?.roomNumber} · Scheduled:{' '}
                        <strong style={{ color: '#1e293b' }}>
                          {new Date(t.scheduledDate).toLocaleDateString()}
                        </strong>
                      </div>
                      {overdue && (
                        <div style={{
                          fontSize: 12,
                          color: '#dc2626',
                          marginTop: 4,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          ⚠ Overdue — needs attention
                        </div>
                      )}
                      {t.notes && (
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                          Notes: {t.notes}
                        </div>
                      )}
                    </div>
                    <Badge status={t.status} />
                  </div>
                </Card>
              );
            })}
        </Section>
      )}
    </div>
  );
};

export default MaintenanceDashboard;
