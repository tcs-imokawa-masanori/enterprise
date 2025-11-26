export type Role = 'admin' | 'analyst' | 'viewer';
export interface User {
  id: string;
  username: string;
  displayName: string;
  roles: Role[];
  groups: string[];
  disabled?: boolean;
}

export interface AuthState {
  currentUser: User | null;
  users: User[];
  groups: { id: string; name: string; members: string[] }[];
}

const KEY = 'ea_auth_state_v1';

function seed(): AuthState {
  const admin: User = {
    id: 'u-admin',
    username: 'admin',
    displayName: 'Administrator',
    roles: ['admin'],
    groups: ['g-admins']
  };
  return {
    currentUser: null,
    users: [admin],
    groups: [{ id: 'g-admins', name: 'Admins', members: ['u-admin'] }]
  };
}

export const authStore = {
  load(): AuthState {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    try { return JSON.parse(raw) as AuthState; } catch { const s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
  },
  save(state: AuthState) { localStorage.setItem(KEY, JSON.stringify(state)); },
  login(username: string, password: string): { ok: boolean; message?: string } {
    const st = this.load();
    // Simple credential rule: admin/admin123 default; others use username + '123' as password
    const user = st.users.find(u => u.username === username && !u.disabled);
    if (!user) return { ok: false, message: 'User not found or disabled' };
    const valid = (user.username === 'admin' && password === 'admin123') || password === `${user.username}123`;
    if (!valid) return { ok: false, message: 'Invalid credentials' };
    st.currentUser = user;
    this.save(st);
    return { ok: true };
  },
  logout() { const st = this.load(); st.currentUser = null; this.save(st); },
  addUser(u: Omit<User, 'id'>): User {
    const st = this.load();
    const user: User = { id: `u-${Date.now()}`, ...u };
    st.users.push(user);
    this.save(st);
    return user;
  },
  updateUser(user: User) { const st = this.load(); st.users = st.users.map(u => u.id === user.id ? user : u); this.save(st); },
  deleteUser(id: string) { const st = this.load(); st.users = st.users.filter(u => u.id !== id); st.groups.forEach(g => g.members = g.members.filter(m => m !== id)); this.save(st); },
  addGroup(name: string) { const st = this.load(); const g = { id: `g-${Date.now()}`, name, members: [] as string[] }; st.groups.push(g); this.save(st); return g; },
  assignToGroup(userId: string, groupId: string) { const st = this.load(); const g = st.groups.find(x => x.id === groupId); if (g && !g.members.includes(userId)) g.members.push(userId); const u = st.users.find(u => u.id === userId); if (u && !u.groups.includes(groupId)) u.groups.push(groupId); this.save(st); },
  removeFromGroup(userId: string, groupId: string) { const st = this.load(); const g = st.groups.find(x => x.id === groupId); if (g) g.members = g.members.filter(m => m !== userId); const u = st.users.find(u => u.id === userId); if (u) u.groups = u.groups.filter(gid => gid !== groupId); this.save(st); }
};



