// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { loginUser } from '../api/auth.api';
// import { useNavigate } from 'react-router-dom';

// const Login: React.FC = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const data = await loginUser({ email, password });
//       login(data.accessToken);
//       navigate('/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;



import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../api/auth.api';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser({ email, password });
      login(data.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md glass p-12 rounded-[3.5rem] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
        {/* Accent Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-5xl font-black text-white mb-3 tracking-tighter text-gradient">Hello.</h2>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Enter your vault credentials</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white/30 outline-none transition-all placeholder:text-zinc-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white/30 outline-none transition-all placeholder:text-zinc-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-5 rounded-3xl hover:bg-zinc-200 transition-all shadow-xl active:scale-[0.98] mt-4"
          >
            Authenticate
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-zinc-500 font-bold uppercase tracking-widest relative z-10">
          No account? <Link to="/register" className="text-white hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;