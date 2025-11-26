import { useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { authStore, Role, User } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPanel() {
  const { isDarkMode } = useTheme();
  const { user, hasRole } = useAuth();
  const [state, setState] = useState(() => authStore.load());
  const [newUser, setNewUser] = useState<{ username: string; displayName: string; roles: Role[] }>({ username: '', displayName: '', roles: ['viewer'] });
  const [groupName, setGroupName] = useState('');

  const reload = () => setState(authStore.load());
  const addUser = () => { if (!newUser.username) return; authStore.addUser({ ...newUser, groups: [] }); setNewUser({ username: '', displayName: '', roles: ['viewer'] }); reload(); };
  const toggleRole = (u: User, role: Role) => { const roles = u.roles.includes(role) ? u.roles.filter(r => r !== role) : [...u.roles, role]; authStore.updateUser({ ...u, roles }); reload(); };
  const disableUser = (u: User) => { authStore.updateUser({ ...u, disabled: !u.disabled }); reload(); };
  const createGroup = () => { if (!groupName) return; authStore.addGroup(groupName); setGroupName(''); reload(); };
  const assign = (uid: string, gid: string) => { authStore.assignToGroup(uid, gid); reload(); };
  const remove = (uid: string, gid: string) => { authStore.removeFromGroup(uid, gid); reload(); };

  if (!user || !hasRole('admin')) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
        Admin access required
      </div>
    );
  }

  return (
    <div className={`w-full h-full overflow-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {state.users.map(u => (
            <div key={u.id} className={`p-3 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{u.displayName || u.username} {u.disabled && <span className="text-xs text-red-500">(disabled)</span>}</div>
                  <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{u.username}</div>
                </div>
                <button onClick={() => disableUser(u)} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>{u.disabled ? 'Enable' : 'Disable'}</button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {(['admin','analyst','viewer'] as Role[]).map(r => (
                  <button key={r} onClick={() => toggleRole(u, r)} className={`px-2 py-1 rounded text-xs border ${u.roles.includes(r) ? 'bg-blue-600 text-white' : (isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-300')}`}>{r}</button>
                ))}
              </div>
              <div className="mt-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">Groups: {u.groups.join(', ') || '-'}</div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {state.groups.map(g => (
                  <button key={g.id} onClick={() => (u.groups.includes(g.id) ? remove(u.id, g.id) : assign(u.id, g.id))} className={`px-2 py-1 rounded text-xs ${u.groups.includes(g.id) ? 'bg-green-700 text-green-100' : (isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700')}`}>{g.name}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-end">
          <div>
            <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
            <input value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} className={`px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Display Name</label>
            <input value={newUser.displayName} onChange={e => setNewUser({ ...newUser, displayName: e.target.value })} className={`px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <button onClick={addUser} className="px-3 py-2 rounded bg-blue-600 text-white">Add User</button>
        </div>
      </div>

      <div className={`rounded-lg border p-4 mt-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Groups</h2>
        <div className="flex gap-2 mb-3">
          <input placeholder="New group name" value={groupName} onChange={e => setGroupName(e.target.value)} className={`px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
          <button onClick={createGroup} className="px-3 py-2 rounded bg-blue-600 text-white">Create</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {state.groups.map(g => (
            <div key={g.id} className={`p-3 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{g.name}</div>
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Members: {g.members.length}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



