import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '../../firebase';

export default function Login() {
  const { login, refreshUser } = useAuth(); // include refreshUser
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      await refreshUser(); // fetch MongoDB profile
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User Info:', result.user);

      // OPTIONAL: Create user in backend if not exists
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
        }),
      });

      await refreshUser(); // fetch MongoDB profile
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#052c44] via-[#0a3c4c] to-[#0c5346] px-4 text-white">
      <form onSubmit={handleSubmit} className="bg-[#093241] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Login to FinGURU</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 bg-[#0a3c4c] text-white border border-[#0c5346] rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 bg-[#0a3c4c] text-white border border-[#0c5346] rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit" className="bg-green-400 hover:bg-green-500 text-black w-full py-3 rounded-lg font-semibold transition">
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="bg-transparent border border-green-400 hover:bg-green-400 hover:text-black text-green-400 w-full py-3 rounded-lg font-semibold mt-4 transition"
        >
          Sign in with Google
        </button>

        <div className="flex justify-between text-sm mt-4 text-gray-300">
          <a href="/forgot-password" className="hover:underline hover:text-green-400">Forgot Password?</a>
          <a href="/register" className="hover:underline hover:text-green-400">Register</a>
        </div>
      </form>
    </div>
  );
}
