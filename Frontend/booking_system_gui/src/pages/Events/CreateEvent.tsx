// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../../api/axios';

// const CreateEvent: React.FC = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     category: '',
//     location: '',
//     date: '',
//     time: '',
//     totalTickets: 0,
//     ticketPrice: 0,
//   });
//   const [image, setImage] = useState<File | null>(null);
//   const [error, setError] = useState('');

//   // --- HELPER LOGIC: 24-HOUR VALIDATION ---
  
//   // Gets the date string for "Tomorrow" (YYYY-MM-DD) for the date picker 'min' attribute
//   const getMinDate = () => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1); 
//     return tomorrow.toISOString().split('T')[0];
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setForm({
//       ...form,
//       [name]: name === 'totalTickets' || name === 'ticketPrice' ? Number(value) : value,
//     });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       if (!selectedFile.type.startsWith('image/')) {
//         setError('Only image files are allowed.');
//         return;
//       }
//       setImage(selectedFile);
//       setError('');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // 1. Image Check
//     if (!image) {
//       setError('Event image is required');
//       return;
//     }

//     // 2. Strict 24-Hour Check (Frontend Safety)
//     const selectedDateTime = new Date(`${form.date}T${form.time}`);
//     const minAllowedTime = new Date();
//     minAllowedTime.setHours(minAllowedTime.getHours() + 24);

//     if (selectedDateTime < minAllowedTime) {
//       setError('Events must be scheduled at least 24 hours from current time.');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       Object.entries(form).forEach(([key, value]) => formData.append(key, value as any));
//       formData.append('image', image);

//       await API.post('/events/create', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       alert('Event created successfully!');
//       navigate('/dashboard');
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Failed to create event');
//     }
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//         <h2>Create Event</h2>
//         {error && <p style={{ color: 'white', background: 'red', padding: '10px', borderRadius: '4px' }}>{error}</p>}

//         <input name="name" placeholder="Event Name" onChange={handleChange} required />
//         <textarea name="description" placeholder="Description" onChange={handleChange} required style={{ height: '80px' }} />
//         <input name="category" placeholder="Category" onChange={handleChange} required />
//         <input name="location" placeholder="Location" onChange={handleChange} required />
        
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <div style={{ flex: 1 }}>
//             <label style={{ fontSize: '12px', display: 'block' }}>Event Date (Min: Tomorrow)</label>
//             <input 
//               name="date" 
//               type="date" 
//               min={getMinDate()} // Prevents selection of today or past
//               onChange={handleChange} 
//               required 
//               style={{ width: '100%' }}
//             />
//           </div>
//           <div style={{ flex: 1 }}>
//             <label style={{ fontSize: '12px', display: 'block' }}>Event Time</label>
//             <input 
//               name="time" 
//               type="time" 
//               onChange={handleChange} 
//               required 
//               style={{ width: '100%' }}
//             />
//           </div>
//         </div>

//         <input
//           name="totalTickets"
//           type="number"
//           placeholder="Total Tickets"
//           min={1}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="ticketPrice"
//           type="number"
//           placeholder="Ticket Price"
//           min={0}
//           step={0.01}
//           onChange={handleChange}
//           required
//         />

//         <label style={{ fontSize: '12px' }}>Event Banner Image</label>
//         <input type="file" accept="image/*" onChange={handleFileChange} required />

//         <button type="submit" style={{ marginTop: 10, padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
//           Create Event
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateEvent;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    date: '',
    time: '',
    totalTickets: 0,
    ticketPrice: 0,
  });

  // Validation: Minimum 24 hours in advance
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.includes('Tickets') || name === 'ticketPrice' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));
    if (image) formData.append('image', image);

    try {
      await API.post('/events/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Event Published!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check all fields and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <header className="mb-12">
        <h1 className="text-6xl font-black text-white tracking-tighter">Host.</h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Bring a new experience to life</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Creative Details */}
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Event Title</label>
            <input 
              name="name" 
              placeholder="e.g. Midnight Jazz Session" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none transition-all placeholder:text-zinc-700" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">The Experience</label>
            <textarea 
              name="description" 
              placeholder="What makes this event special?" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white h-64 focus:border-white/30 outline-none resize-none placeholder:text-zinc-700" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category</label>
              <input name="category" placeholder="Music, Art, Tech..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Venue / Location</label>
              <input name="location" placeholder="City or Full Address" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* Right Side: Logistics & Action */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[3rem] space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Timing</label>
              <input name="date" type="date" min={getMinDate()} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" onChange={handleChange} required />
              <input name="time" type="time" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm mt-2" onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Inventory & Cost</label>
              <div className="grid grid-cols-2 gap-3">
                <input name="totalTickets" type="number" placeholder="Tickets" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" onChange={handleChange} required />
                <input name="ticketPrice" type="number" placeholder="Price $" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Cover Image</label>
              <div className="relative group cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="w-full text-[10px] text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-white file:text-black hover:file:bg-zinc-200" 
                  onChange={(e) => e.target.files && setImage(e.target.files[0])} 
                  required 
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center">
               <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Go Live'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;