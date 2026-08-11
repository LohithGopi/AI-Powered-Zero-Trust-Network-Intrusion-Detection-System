import React, { useState } from 'react';
import { Users, UserPlus, Shield, Lock, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UsersView = () => {
  const { role } = useAuth();
  const isAdmin = role === 'Admin';

  const [usersList, setUsersList] = useState([
    { id: 1, name: 'System Admin', email: 'admin@jnnce.ac.in', role: 'Admin', status: 'Active', lastLogin: '2026-08-10 16:50', createdAt: '2026-08-01' },
    { id: 2, name: 'Security Analyst', email: 'analyst@jnnce.ac.in', role: 'Analyst', status: 'Active', lastLogin: '2026-08-10 14:15', createdAt: '2026-08-02' },
    { id: 3, name: 'Academic Viewer', email: 'viewer@jnnce.ac.in', role: 'User', status: 'Active', lastLogin: '2026-08-09 11:20', createdAt: '2026-08-05' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Analyst');

  if (!isAdmin) {
    return (
      <div className="p-12 text-center bg-white border border-red-200 rounded-2xl shadow-sm">
        <Lock className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-700">403 Forbidden — Access Denied</h3>
        <p className="text-xs text-[#475569] mt-2">Zero Trust RBAC policy restricts User Management privileges exclusively to the <strong className="text-[#172033]">Admin</strong> role.</p>
      </div>
    );
  }

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsersList([...usersList, newUser]);
    setShowAddModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            ADMINISTRATIVE ACCESS CONTROL
          </span>
          <h2 className="text-xl font-bold text-[#172033] mt-1">User Management & RBAC Permissions</h2>
          <p className="text-xs text-[#475569]">Manage user access tiers, role assignments, and authentication status.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0F3B68] px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F7FA] text-[#475569] font-mono text-[10px] uppercase border-b border-[#E2E8F0]">
            <tr>
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#172033]">{u.name}</td>
                <td className="py-3 px-4 font-mono text-[#475569]">{u.email}</td>
                <td className="py-3 px-4 font-mono">
                  <span className={`px-2 py-0.5 rounded border text-[10px] ${u.role === 'Admin' ? 'bg-red-50 text-red-700 border-red-200' : u.role === 'Analyst' ? 'bg-blue-50 text-[#1769E0] border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-emerald-600 font-bold">{u.status}</td>
                <td className="py-3 px-4 font-mono text-[#475569]">{u.lastLogin}</td>
                <td className="py-3 px-4 font-mono text-[#475569]">{u.createdAt}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => alert('Editing user permissions...')} className="text-[#1769E0] hover:underline">
                    <Edit className="h-3.5 w-3.5 inline" />
                  </button>
                  <button onClick={() => setUsersList(usersList.filter(item => item.id !== u.id))} className="text-red-600 hover:underline">
                    <Trash2 className="h-3.5 w-3.5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-[#172033] mb-4">Add User to Security Portal</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">User Full Name</label>
                <input 
                  type="text" required value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Dr. Shivakumar J."
                  className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#172033] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">Institutional Email</label>
                <input 
                  type="email" required value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="coordinator@jnnce.ac.in"
                  className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#172033] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">Assigned RBAC Role</label>
                <select 
                  value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#172033] outline-none"
                >
                  <option value="Admin">Admin (Full Control)</option>
                  <option value="Analyst">Security Analyst (Operations)</option>
                  <option value="User">User (Read Only)</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-lg bg-[#F5F7FA] text-xs text-[#475569] border border-[#E2E8F0]">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#1769E0] text-xs font-semibold text-white">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
