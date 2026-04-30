import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import NavBar from '../components/NavBar';
import { Badge, Btn, Card, StatCard, Section, Spinner, TableWrap, TR, TD } from '../components/UI';

const WardenDashboard = () => {
  const [tab, setTab] = useState('Dashboard');
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assign state
  const [assigningId, setAssigningId] = useState(null);
  const [selStaff, setSelStaff] = useState('');
  const [schedDate, setSchedDate] = useState('');
  const [assignMsg, setAssignMsg] = useState('');

  // Room allocation state
  const [allocStu, setAllocStu] = useState('');
  const [allocRoom, setAllocRoom] = useState('');
  const [allocMsg, setAllocMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, sRes, rRes, staffRes, mRes] = await Promise.all([
        API.get('/complaints'),
        API.get('/students'),
        API.get('/rooms'),
        API.get('/users?role=maintenance_staff'),
        API.get('/maintenance'),
      ]);
      setComplaints(cRes.data.complaints);
      setStudents(sRes.data.students);
      setRooms(rRes.data.rooms);
      setStaffList(staffRes.data.users);
      setMaintenance(mRes.data.tasks);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAssign = async (complaintId) => {
    if (!selStaff) { setAssignMsg('Please select a staff member.'); return; }
    try {
      const res = await API.post('/maintenance', {
        complaintId,
        staffId: selStaff,
        scheduledDate: schedDate || undefined,
      });
      setMaintenance(p => {
        const existing = p.find(m => m.complaintId?._id === complaintId);
        if (existing) return p.map(m => m.complaintId?._id === complaintId ? res.data.maintenance : m);
        return [...p, res.data.maintenance];
      });
      setComplaints(p => p.map(c => c._id === complaintId ? { ...c, status: 'In Progress' } : c));
      setAssigningId(null); setSelStaff(''); setSchedDate('');
    } catch (err) {
      setAssignMsg(err.response?.data?.message || 'Assignment failed.');
    }
  };

  const handleAllocate = async () => {
    if (!allocStu || !allocRoom) { setAllocMsg('Select both student and room.'); return; }
    try {
      const room = rooms.find(r => r._id === allocRoom);
      await API.put('/rooms/allocate', { studentId: allocStu, roomNumber: room.roomNumber });
      setStudents(p => p.map(s => s._id === allocStu ? { ...s, roomNumber: room.roomNumber } : s));
      setRooms(p => p.map(r => r._id === allocRoom ? { ...r, status: 'occupied' } : r));
      setAllocMsg('Room allocated successfully!');
      setAllocStu(''); setAllocRoom('');
      setTimeout(() => setAllocMsg(''), 3000);
    } catch (err) {
      setAllocMsg(err.response?.data?.message || 'Allocation failed.');
    }
  };

  const labelStyle = {
    fontSize: 13,
    color: '#475569',
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
  };

  if (loading) return <><NavBar tabs={[]} activeTab="" setActiveTab={() => {}} /><Spinner /></>;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      <NavBar
        tabs={['Dashboard', 'Complaints', 'Room Allocation', 'Hostel Records']}
        activeTab={tab} setActiveTab={setTab}
      />

      {/* ── Dashboard ── */}
      {tab === 'Dashboard' && (
        <Section title="Warden Dashboard">
          <div style={{ display: 'flex', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
            <StatCard label="Total Complaints" value={complaints.length} />
            <StatCard label="Open" value={complaints.filter(c => c.status === 'Open').length} color="#d97706" />
            <StatCard label="In Progress" value={complaints.filter(c => c.status === 'In Progress').length} color="#2563eb" />
            <StatCard label="Resolved" value={complaints.filter(c => c.status === 'Resolved').length} color="#059669" />
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
            <StatCard label="Students" value={students.length} color="#7c3aed" />
            <StatCard label="Rooms" value={rooms.length} color="#0891b2" />
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
              <span style={{ fontSize: 18 }}>⚠️</span>
              Open Complaints — Pending Assignment
            </div>
            {complaints.filter(c => c.status === 'Open').length === 0 ? (
              <p style={{ color: '#64748b', fontSize: 14 }}>No open complaints.</p>
            ) : complaints.filter(c => c.status === 'Open').map(c => (
              <div key={c._id} style={{
                borderBottom: '1px solid #f1f5f9',
                padding: '14px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 14, marginBottom: 4, color: '#334155' }}>
                    {c.description.slice(0, 70)}...
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    {c.studentId?.name} · Room {c.roomNumber} · {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                  {c.priorityReason && (
                    <div style={{
                      fontSize: 12,
                      color: '#64748b',
                      fontStyle: 'italic',
                      marginTop: 3,
                      padding: '2px 0',
                    }}>
                      AI: {c.priorityReason}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {c.priority && <Badge status={c.priority} />}
                  <Btn onClick={() => setTab('Complaints')} small>Assign</Btn>
                </div>
              </div>
            ))}
          </Card>
        </Section>
      )}

      {/* ── Complaints ── */}
      {tab === 'Complaints' && (
        <Section title="Monitor Complaints">
          {assignMsg && <p className="error" style={{ marginBottom: 14 }}>{assignMsg}</p>}
          {complaints.map(c => {
            const m = maintenance.find(mt => mt.complaintId?._id === c._id);
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
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                      {c.studentId?.name} · Room {c.roomNumber} · {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                    {m && (
                      <div style={{
                        fontSize: 13,
                        color: '#64748b',
                        padding: '8px 12px',
                        background: '#f8fafc',
                        borderRadius: 6,
                        borderLeft: '3px solid #2563eb',
                      }}>
                        Assigned: <strong style={{ color: '#1e293b' }}>{m.staffId?.name}</strong>
                        {m.scheduledDate ? ` · Scheduled: ${new Date(m.scheduledDate).toLocaleDateString()}` : ''}
                        {m.notes ? ` · ${m.notes}` : ''}
                      </div>
                    )}
                    {c.priorityReason && (
                      <div style={{
                        fontSize: 12,
                        fontStyle: 'italic',
                        color: '#94a3b8',
                        marginTop: 6,
                      }}>
                        AI: {c.priorityReason}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <Badge status={c.status} />
                    {c.priority && <Badge status={c.priority} />}
                    {c.status !== 'Resolved' && (
                      assigningId === c._id ? (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          alignItems: 'flex-end',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: 8,
                          animation: 'fadeIn 0.2s ease',
                        }}>
                          <select value={selStaff} onChange={e => setSelStaff(e.target.value)} style={{ minWidth: 160 }}>
                            <option value="">Select staff</option>
                            {staffList.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                          </select>
                          <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)}
                            style={{ fontSize: 12 }} />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Btn onClick={() => handleAssign(c._id)} small color="#059669">Confirm</Btn>
                            <Btn onClick={() => setAssigningId(null)} small outline>Cancel</Btn>
                          </div>
                        </div>
                      ) : (
                        <Btn onClick={() => { setAssigningId(c._id); setSelStaff(''); setSchedDate(''); }} small>
                          {m ? 'Reassign' : 'Assign'}
                        </Btn>
                      )
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </Section>
      )}

      {/* ── Room Allocation ── */}
      {tab === 'Room Allocation' && (
        <Section title="Room Allocation Management">
          <Card style={{ maxWidth: 520, marginBottom: 24 }}>
            <div style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 18,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>🔑</span>
              Allocate Student to Room
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Student</label>
              <select value={allocStu} onChange={e => setAllocStu(e.target.value)} style={{ width: '100%' }}>
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name} (current: {s.roomNumber})</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>New Room</label>
              <select value={allocRoom} onChange={e => setAllocRoom(e.target.value)} style={{ width: '100%' }}>
                <option value="">Select room</option>
                {rooms.filter(r => r.status !== 'maintenance').map(r => (
                  <option key={r._id} value={r._id}>
                    Room {r.roomNumber} — capacity {r.capacity} — {r.status}
                  </option>
                ))}
              </select>
            </div>
            {allocMsg && (
              <p className={allocMsg.includes('success') ? 'success' : 'error'}
                style={{ marginBottom: 14 }}>{allocMsg}</p>
            )}
            <Btn onClick={handleAllocate}>Allocate Room</Btn>
          </Card>

          <Card>
            <div style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 16,
              color: '#1e293b',
            }}>Current Allocations</div>
            <TableWrap headers={['Student', 'Room No.', 'Contact', 'Joined']}>
              {students.map(s => (
                <TR key={s._id}>
                  <TD><span style={{ fontWeight: 500 }}>{s.name}</span></TD>
                  <TD><strong>{s.roomNumber}</strong></TD>
                  <TD style={{ color: '#64748b' }}>{s.contact || '—'}</TD>
                  <TD style={{ color: '#64748b' }}>{new Date(s.createdAt).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TableWrap>
          </Card>
        </Section>
      )}

      {/* ── Hostel Records ── */}
      {tab === 'Hostel Records' && (
        <Section title="Hostel Records">
          <div style={{
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 14,
            color: '#1e293b',
          }}>Rooms</div>
          <Card>
            <TableWrap headers={['Room No.', 'Capacity', 'Status', 'Created']}>
              {rooms.map(r => (
                <TR key={r._id}>
                  <TD><strong>{r.roomNumber}</strong></TD>
                  <TD>{r.capacity}</TD>
                  <TD><Badge status={r.status} /></TD>
                  <TD style={{ color: '#64748b' }}>{new Date(r.createdAt).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TableWrap>
          </Card>
        </Section>
      )}
    </div>
  );
};

export default WardenDashboard;
