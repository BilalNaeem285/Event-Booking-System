// import React, { useState } from 'react';
// import API from '../api/axios';
// import { useNavigate } from 'react-router-dom';

// const Register: React.FC = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     role: 'USER',
//   });
//   const [error, setError] = useState('');

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // FRONTEND VALIDATION
//     if (form.phone.length !== 11) {
//       setError('Phone number must be exactly 11 digits');
//       return;
//     }

//     if (form.password !== form.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       await API.post('/auth/register', form);
//       alert('Registration successful!');
//       navigate('/login');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Register</h2>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <input
//         name="name"
//         placeholder="Name"
//         required
//         onChange={handleChange}
//       />

//       <input
//         name="email"
//         type="email"
//         placeholder="Email"
//         required
//         onChange={handleChange}
//       />

//       <input
//         name="phone"
//         placeholder="Phone (11 digits)"
//         required
//         onChange={handleChange}
//       />

//       <input
//         name="password"
//         type="password"
//         placeholder="Password"
//         required
//         onChange={handleChange}
//       />

//       <input
//         name="confirmPassword"
//         type="password"
//         placeholder="Confirm Password"
//         required
//         onChange={handleChange}
//       />

//       <select name="role" onChange={handleChange}>
//         <option value="USER">User</option>
//         <option value="CREATOR">Creator</option>
//       </select>

//       <button type="submit">Register</button>
//     </form>
//   );
// };

// export default Register;








import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'USER',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.phone.length !== 11) { setError('Phone number must be exactly 11 digits'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err: any) { setError(err.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl glass p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-white tracking-tighter mb-3 text-gradient">Join Now.</h2>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Start your journey with Evento</p>
        </div>

        {error && <p className="mb-6 text-red-500 text-[10px] font-black uppercase text-center tracking-widest bg-red-500/10 py-3 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="name" placeholder="Full Name" className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" onChange={handleChange} required />
          
          <select name="role" className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-zinc-400 outline-none appearance-none" onChange={handleChange}>
            <option value="USER" className="bg-[#050505]">Attendee (Book Tickets)</option>
            <option value="CREATOR" className="bg-[#050505]">Organizer (Create Events)</option>
          </select>

          <button type="submit" className="md:col-span-2 w-full bg-white text-black py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl">
            Create Account
          </button>
        </form>
        <p className="text-center mt-10 text-xs text-zinc-500 font-bold uppercase tracking-widest">
            Already have an account? <Link to="/login" className="text-white">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;