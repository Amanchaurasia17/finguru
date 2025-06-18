import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import app from '../../firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Check your email for reset instructions.');
      setError('');
    } catch (err) {
      setError('Failed to send reset email. Please check the email address and try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#052c44] via-[#0a3c4c] to-[#0c5346] px-4 text-white">
      <form onSubmit={handleSubmit} className="bg-[#093241] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Reset Your Password</h2>
        
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-400 text-sm mb-4 text-center">{message}</p>}
        
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-3 bg-[#0a3c4c] text-white border border-[#0c5346] rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={e => setEmail(e.target.value)}
          required
        />
        
        <button type="submit" className="bg-green-400 hover:bg-green-500 text-black w-full py-3 rounded-lg font-semibold transition">
          Send Reset Link
        </button>
        
        <div className="text-sm mt-4 text-center text-gray-300">
          <a href="/login" className="hover:underline hover:text-green-400">Back to Login</a>
        </div>
      </form>
    </div>
  );
}
