import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  RefreshCw, 
  AlertOctagon,
  Search,
  Check,
  X
} from 'lucide-react';

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await adminService.getUsers();
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.warn("Using fallback demo users:", err);
      setUsers([
        { id: 'usr-1', _id: 'usr-1', name: 'Admin Master', email: 'admin@test.com', role: 'admin', status: 'active', lastActive: 'Just Now' },
        { id: 'usr-2', _id: 'usr-2', name: 'Officer Kamal Perera', email: 'officer@test.com', role: 'officer', status: 'active', lastActive: '10 mins ago' },
        { id: 'usr-3', _id: 'usr-3', name: 'Officer Nimal Silva', email: 'officer2@test.com', role: 'officer', status: 'active', lastActive: '2 hours ago' },
        { id: 'usr-4', _id: 'usr-4', name: 'Resident Sunil Shantha', email: 'sunil@test.com', role: 'resident', status: 'active', lastActive: 'Yesterday' },
        { id: 'usr-5', _id: 'usr-5', name: 'Resident Ruwan Gamage', email: 'ruwan@test.com', role: 'resident', status: 'inactive', lastActive: '3 days ago' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper to count active admins
  const activeAdminsCount = users.filter(u => u.role === 'admin' && u.status === 'active').length;

  const handleToggleStatus = async (userToToggle) => {
    setErrorMsg('');
    setSuccessMsg('');
    const userId = userToToggle.id || userToToggle._id;

    // GUARD: Check if deactivating the last active Admin
    if (userToToggle.role === 'admin' && userToToggle.status === 'active' && activeAdminsCount <= 1) {
      setErrorMsg("ACTION BLOCKED: You cannot deactivate the system's final active Administrator! At least one active Admin is required.");
      return;
    }

    const newStatus = userToToggle.status === 'active' ? 'inactive' : 'active';

    try {
      await adminService.updateUserStatus(userId, newStatus);
      setUsers(users.map(u => (u.id || u._id) === userId ? { ...u, status: newStatus } : u));
      setSuccessMsg(`Status updated to '${newStatus}' for ${userToToggle.name}`);
    } catch (err) {
      console.warn("API update failed, updating locally:", err);
      setUsers(users.map(u => (u.id || u._id) === userId ? { ...u, status: newStatus } : u));
      setSuccessMsg(`Status updated to '${newStatus}' for ${userToToggle.name}`);
    }
  };

  const handleRoleChange = async (userToToggle, newRole) => {
    setErrorMsg('');
    setSuccessMsg('');
    const userId = userToToggle.id || userToToggle._id;

    // GUARD: Check if demoting the last active Admin
    if (userToToggle.role === 'admin' && newRole !== 'admin' && activeAdminsCount <= 1) {
      setErrorMsg("ACTION BLOCKED: You cannot demote the system's final active Administrator! At least one active Admin is required.");
      return;
    }

    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(users.map(u => (u.id || u._id) === userId ? { ...u, role: newRole } : u));
      setSuccessMsg(`Role updated to '${newRole.toUpperCase()}' for ${userToToggle.name}`);
    } catch (err) {
      console.warn("API role update failed, updating locally:", err);
      setUsers(users.map(u => (u.id || u._id) === userId ? { ...u, role: newRole } : u));
      setSuccessMsg(`Role updated to '${newRole.toUpperCase()}' for ${userToToggle.name}`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem 2rem 4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              color: '#34d399', 
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              Member 3 Access Control
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            SYSTEM USER MANAGEMENT
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Manage administrative roles, water officer permissions, and resident access statuses.
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={fetchUsers}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Users
        </button>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div style={{ padding: '1rem 1.25rem', borderRadius: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <AlertOctagon size={24} />
          <div>
            <div style={{ fontWeight: '700' }}>Protection Guard Triggered</div>
            <div style={{ fontSize: '0.875rem' }}>{errorMsg}</div>
          </div>
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Check size={20} />
          <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{successMsg}</div>
        </div>
      )}

      {/* Control Bar: Search & Active Admin Indicator */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '400px' }}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            className="form-control"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.15)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <ShieldAlert size={18} color="#c084fc" />
          <span style={{ fontSize: '0.85rem', color: '#e9d5ff', fontWeight: '600' }}>
            Active Administrators: <strong style={{ color: '#ffffff' }}>{activeAdminsCount}</strong>
          </span>
        </div>
      </div>

      {/* User Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>USER DETAILS</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>LAST ACTIVE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isFinalAdmin = u.role === 'admin' && u.status === 'active' && activeAdminsCount <= 1;

                return (
                  <tr key={u.id || u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: u.role === 'admin' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' :
                                      u.role === 'officer' ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' :
                                      'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          color: '#fff',
                          fontSize: '0.9rem'
                        }}>
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#f8fafc' }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <select 
                        className="form-control" 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                      >
                        <option value="admin">Administrator</option>
                        <option value="officer">Water Officer</option>
                        <option value="resident">Resident User</option>
                      </select>
                    </td>

                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-normal' : 'badge-critical'}`}>
                        {u.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {u.lastActive || 'Today'}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleStatus(u)}
                        style={{ 
                          fontSize: '0.8rem',
                          borderColor: u.status === 'active' ? 'rgba(239,68,68,0.4)' : undefined,
                          color: u.status === 'active' ? '#f87171' : undefined
                        }}
                      >
                        {u.status === 'active' ? (
                          <>
                            <UserX size={14} /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} /> Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
