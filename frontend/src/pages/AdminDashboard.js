import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import NavBar from '../components/NavBar';
import { Badge, Btn, Card, StatCard, Section, Spinner, TableWrap, TR, TD } from '../components/UI';

const AdminDashboard = () => {
  const [tab, setTab] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({ roomNumber: '', capacity: '', status: 'available' });
  const [roomMsg, setRoomMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, rRes, cRes, mRes, sRes] = await Promise.all([
        API.get('/users'),
        API.get('/rooms'),
        API.get('/complaints'),
        API.get('/maintenance'),
        API.get('/students'),
      ]);
      setUsers(uRes.data.users);
      setRooms(rRes.data.rooms);
      setComplaints(cRes.data.complaints);
      setMaintenance(mRes.data.tasks);
      setStudents(sRes.data.students);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddRoom = async () => {
    if (!newRoom.roomNumber || !newRoom.capacity) {
      setRoomMsg('Fill all fields.'); return;
    }
    try {
      const res = await API.post('/rooms', { ...newRoom, capacity: parseInt(newRoom.capacity) });
      setRooms(p => [...p, res.data.room]);
      setNewRoom({ roomNumber: '', capacity: '', status: 'available' });
      setRoomMsg('Room added successfully!');
      setTimeout(() => setRoomMsg(''), 3000);
    } catch (err) {
      setRoomMsg(err.response?.data?.message || 'Failed to add room.');
    }
  };

  const handleUpdateRoomStatus = async (id, status) => {
    try {
      await API.put(`/rooms/${id}`, { status });
      setRooms(p => p.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await API.delete(`/users/${userId}`);
      setUsers(p => p.filter(u => u._id !== userId));
      setStudents(p => p.filter(s => s.userId?._id !== userId && s.userId !== userId));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <><NavBar tabs={[]} activeTab="" setActiveTab={() => {}} /><Spinner /></>;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      <NavBar
        tabs={['Dashboard', 'Manage Users', 'Manage Rooms', 'Operations']}
        activeTab={tab} setActiveTab={setTab}
      />

      {/* ── Dashboard ── */}
      {tab === 'Dashboard' && (
        <Section title="Admin Dashboard">
          <div style={{ display: 'flex', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
            <StatCard label="Users" value={users.length} color="#7c3aed" />
            <StatCard label="Students" value={students.length} color="#0891b2" />
            <StatCard label="Rooms" value={rooms.length} color="#1B4F72" />
            <StatCard label="Complaints" value={complaints.length} color="#d97706" />
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
            <StatCard label="Open" value={complaints.filter(c => c.status === 'Open').length} color="#d97706" />
            <StatCard label="In Progress" value={complaints.filter(c => c.status === 'In Progress').length} color="#2563eb" />
            <StatCard label="Resolved" value={complaints.filter(c => c.status === 'Resolved').length} color="#059669" />
            <StatCard label="Maintenance Tasks" value={maintenance.length} color="#dc2626" />
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
              <span style={{ fontSize: 18 }}>🏪</span>
              Room Status Overview
            </div>
            {['available', 'occupied', 'maintenance'].map(s => (
              <div key={s} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f1f5f9',
                fontSize: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: s === 'available' ? '#059669' : s === 'occupied' ? '#2563eb' : '#d97706',
                    flexShrink: 0,
                  }} />
                  <span style={{ textTransform: 'capitalize', fontWeight: 500, color: '#334155' }}>{s}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                    {rooms.filter(r => r.status === s).length} rooms
                  </span>
                  <Badge status={s} />
                </div>
              </div>
            ))}
          </Card>
        </Section>
      )}

      {/* ── Manage Users ── */}
      {tab === 'Manage Users' && (
        <Section title="Manage Users">
          <Card>
            <TableWrap headers={['Name', 'Email', 'Role', 'Joined', 'Actions']}>
              {users.map(u => (
                <TR key={u._id}>
                  <TD><span style={{ fontWeight: 500 }}>{u.name}</span></TD>
                  <TD style={{ color: '#64748b' }}>{u.email}</TD>
                  <TD>
                    <span style={{
                      textTransform: 'capitalize',
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: '#f1f5f9',
                      color: '#475569',
                    }}>
                      {u.role?.replace('_', ' ')}
                    </span>
                  </TD>
                  <TD style={{ color: '#64748b' }}>{new Date(u.createdAt).toLocaleDateString()}</TD>
                  <TD>
                    <button onClick={() => handleDeleteUser(u._id)} style={{
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '5px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#fee2e2';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#fef2f2';
                    }}
                    >Remove</button>
                  </TD>
                </TR>
              ))}
            </TableWrap>
          </Card>
        </Section>
      )}

      {/* ── Manage Rooms ── */}
      {tab === 'Manage Rooms' && (
        <Section title="Manage Rooms">
          <Card style={{ maxWidth: 540, marginBottom: 24 }}>
            <div style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 18,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>➕</span>
              Add New Room
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input value={newRoom.roomNumber} onChange={e => setNewRoom(p => ({...p, roomNumber: e.target.value}))}
                placeholder="Room No." style={{ flex: 1, minWidth: 90 }} />
              <input type="number" value={newRoom.capacity} onChange={e => setNewRoom(p => ({...p, capacity: e.target.value}))}
                placeholder="Capacity" style={{ flex: 1, minWidth: 90 }} />
              <select value={newRoom.status} onChange={e => setNewRoom(p => ({...p, status: e.target.value}))} style={{ flex: 1, minWidth: 120 }}>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            {roomMsg && (
              <p className={roomMsg.includes('success') ? 'success' : 'error'}>{roomMsg}</p>
            )}
            <div style={{ marginTop: 16 }}><Btn onClick={handleAddRoom}>Add Room</Btn></div>
          </Card>

          <Card>
            <TableWrap headers={['Room No.', 'Capacity', 'Status', 'Update Status', 'Created']}>
              {rooms.map(r => (
                <TR key={r._id}>
                  <TD><strong>{r.roomNumber}</strong></TD>
                  <TD>{r.capacity}</TD>
                  <TD><Badge status={r.status} /></TD>
                  <TD>
                    <select value={r.status} onChange={e => handleUpdateRoomStatus(r._id, e.target.value)}
                      style={{ fontSize: 12, padding: '6px 10px' }}>
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </TD>
                  <TD style={{ color: '#64748b' }}>{new Date(r.createdAt).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TableWrap>
          </Card>
        </Section>
      )}

      {/* ── Operations ── */}
      {tab === 'Operations' && (
        <Section title="Monitor Hostel Operations">
          <div style={{
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 14,
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>📊</span>
            All Complaints
          </div>
          <Card style={{ marginBottom: 24 }}>
            <TableWrap headers={['Student', 'Room', 'Description', 'Priority', 'Status', 'Date']}>
              {complaints.map(c => (
                <TR key={c._id}>
                  <TD><span style={{ fontWeight: 500 }}>{c.studentId?.name}</span></TD>
                  <TD><strong>{c.roomNumber}</strong></TD>
                  <TD style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.description}
                  </TD>
                  <TD>{c.priority ? <Badge status={c.priority} /> : <span style={{ color: '#94a3b8' }}>—</span>}</TD>
                  <TD><Badge status={c.status} /></TD>
                  <TD style={{ color: '#64748b' }}>{new Date(c.createdAt).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TableWrap>
          </Card>

          <div style={{
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 14,
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🛠</span>
            Maintenance Tasks
          </div>
          <Card>
            <TableWrap headers={['Staff', 'Room', 'Scheduled', 'Notes', 'Status', 'Updated']}>
              {maintenance.map(m => (
                <TR key={m._id}>
                  <TD><span style={{ fontWeight: 500 }}>{m.staffId?.name}</span></TD>
                  <TD><strong>{m.complaintId?.roomNumber}</strong></TD>
                  <TD>{m.scheduledDate ? new Date(m.scheduledDate).toLocaleDateString() : <span style={{ color: '#94a3b8' }}>—</span>}</TD>
                  <TD style={{ color: '#64748b' }}>{m.notes || <span style={{ color: '#94a3b8' }}>—</span>}</TD>
                  <TD><Badge status={m.status} /></TD>
                  <TD style={{ color: '#64748b' }}>{new Date(m.updatedAt).toLocaleDateString()}</TD>
                </TR>
              ))}
            </TableWrap>
          </Card>
        </Section>
      )}
    </div>
  );
};

export default AdminDashboard;
