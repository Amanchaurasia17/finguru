import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import app from '../../firebase';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', phone: '', otp: '' });
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const setupRecaptcha = () => {
    const auth = getAuth(app);
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => {
          console.log('Recaptcha verified');
        },
      },
      auth
    );
  };

  const handleSendOtp = async () => {
    setupRecaptcha();
    const auth = getAuth(app);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, form.phone, window.recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      setIsOtpSent(true);
      console.log('OTP sent');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    const auth = getAuth(app);
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, form.otp);
      await auth.signInWithCredential(credential);
      console.log('Phone number verified');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#052c44] via-[#0a3c4c] to-[#0c5346] px-4 text-white">
      <form onSubmit={handleSubmit} className="bg-[#093241] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Create Your Account</h2>
        
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 bg-[#0a3c4c] text-white border border-[#0c5346] rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 bg-[#0a3c4c] text-white border border-[#0c5346] rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full mb-4 p-3 bg-[#0a3c4c] text-white border border-[#0c5346] rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        
        {isOtpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full mb-4 p-3 bg-[#0a3c4c] text-white border border-[#0c5346] rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={e => setForm({ ...form, otp: e.target.value })}
          />
        )}
        
        {!isOtpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            className="bg-green-400 hover:bg-green-500 text-black w-full py-3 rounded-lg font-semibold transition"
          >
            Send OTP
          </button>
        ) : (
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="bg-green-400 hover:bg-green-500 text-black w-full py-3 rounded-lg font-semibold transition"
          >
            Verify OTP
          </button>
        )}
        
        <button type="submit" className="bg-green-400 hover:bg-green-500 text-black w-full py-3 rounded-lg font-semibold mt-4 transition">
          Register
        </button>

        <div id="recaptcha-container"></div>
        
        <div className="text-sm mt-4 text-center text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="hover:underline hover:text-green-400">Login</a>
        </div>
      </form>
    </div>
  );
}
