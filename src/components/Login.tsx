import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
	const { isDarkMode } = useTheme();
	const { login } = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await login(username.trim(), password);
		if (!res.ok) {
			setError(res.message || 'Login failed');
		} else {
			setError('');
			// Login successful - the App component will automatically redirect to dashboard
		}
	};

	return (
		<div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
			<form onSubmit={submit} className={`w-full max-w-sm p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
				<h1 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sign in</h1>
				{error && <div className="mb-3 text-sm text-red-500">{error}</div>}
				<div className="mb-3">
					<label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
					<input value={username} onChange={e => setUsername(e.target.value)} className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
				</div>
				<div className="mb-4">
					<label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
					<input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
				</div>
				<button type="submit" className="w-full px-3 py-2 rounded bg-blue-600 text-white">Sign in</button>
			</form>
		</div>
	);
}
