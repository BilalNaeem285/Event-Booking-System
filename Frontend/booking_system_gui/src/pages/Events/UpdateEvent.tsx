// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import API from '../../api/axios';

// interface Event {
//   id: number;
//   name: string;
//   description: string;
//   category: string;
//   location: string;
//   date: string;
//   time: string;
//   ticketPrice: number;
//   totalTickets: number;
//   availableTickets: number;
//   imageUrl: string;
// }

// const UpdateEvent: React.FC = () => {
//   const { eventId } = useParams<{ eventId: string }>();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     category: '',
//     location: '',
//     date: '',
//     time: '',
//     ticketPrice: 0,
//     totalTickets: 0,
//   });

//   const [currentImage, setCurrentImage] = useState<string | null>(null);
//   const [newImage, setNewImage] = useState<File | null>(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   // ============================
//   // FETCH EVENT (CREATOR ONLY)
//   // ============================
//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const res = await API.get('/events/my-events');
//         const event = res.data.find((e: Event) => e.id === Number(eventId));

//         if (!event) {
//           alert('Event not found or not yours');
//           navigate('/dashboard');
//           return;
//         }

//         setForm({
//           name: event.name,
//           description: event.description,
//           category: event.category,
//           location: event.location,
//           date: event.date,
//           time: event.time,
//           ticketPrice: event.ticketPrice,
//           totalTickets: event.totalTickets,
//         });

//         setCurrentImage(event.imageUrl);
//       } catch (err) {
//         console.error(err);
//         navigate('/dashboard');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvent();
//   }, [eventId, navigate]);

//   // ============================
//   // INPUT HANDLERS
//   // ============================
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;

//     setForm(prev => ({
//       ...prev,
//       [name]:
//         name === 'ticketPrice' || name === 'totalTickets'
//           ? Number(value)
//           : value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setNewImage(e.target.files[0]);
//     }
//   };

//   // ============================
//   // SUBMIT UPDATE
//   // ============================
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const formData = new FormData();

//       // append ALL fields explicitly
//       formData.append('name', form.name);
//       formData.append('description', form.description);
//       formData.append('category', form.category);
//       formData.append('location', form.location);
//       formData.append('date', form.date);
//       formData.append('time', form.time);
//       formData.append('ticketPrice', String(form.ticketPrice));
//       formData.append('totalTickets', String(form.totalTickets));

//       if (newImage) {
//         formData.append('image', newImage);
//       }

//       // 🚫 DO NOT set Content-Type manually
//       await API.patch(`/events/update/${eventId}`, formData);

//       alert('Event updated successfully!');
//       navigate('/dashboard');
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Failed to update event');
//     }
//   };

//   if (loading) return <p>Loading event data...</p>;

//   // ============================
//   // UI
//   // ============================
//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{ maxWidth: 500, margin: '0 auto' }}
//     >
//       <h2>Update Event</h2>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {currentImage && (
//         <img
//           src={`http://localhost:3001${currentImage}`}
//           alt="Current event"
//           style={{ width: '100%', marginBottom: 10 }}
//         />
//       )}

//       <input
//         name="name"
//         placeholder="Event Name"
//         value={form.name}
//         onChange={handleChange}
//         required
//       />

//       <textarea
//         name="description"
//         placeholder="Description"
//         value={form.description}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="category"
//         placeholder="Category"
//         value={form.category}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="location"
//         placeholder="Location"
//         value={form.location}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="date"
//         type="date"
//         value={form.date}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="time"
//         type="time"
//         value={form.time}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="totalTickets"
//         type="number"
//         placeholder="Total Tickets"
//         value={form.totalTickets}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="ticketPrice"
//         type="number"
//         placeholder="Ticket Price"
//         value={form.ticketPrice}
//         onChange={handleChange}
//         required
//       />

//       <input type="file" accept="image/*" onChange={handleFileChange} />

//       <button type="submit" style={{ marginTop: 10 }}>
//         Update Event
//       </button>
//     </form>
//   );
// };

// export default UpdateEvent;





import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';

const UpdateEvent: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState<File | null>(null);
  
  // 1. Initialize all possible fields
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    date: '',
    time: '',
    ticketPrice: 0,
    totalTickets: 0,
    imageUrl: '' // To show the existing image
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await API.get('/events/my-events');
        const ev = res.data.find((e: any) => e.id === Number(eventId));
        if (ev) {
          setForm({
            name: ev.name,
            description: ev.description,
            category: ev.category,
            location: ev.location,
            date: ev.date,
            time: ev.time,
            ticketPrice: ev.ticketPrice,
            totalTickets: ev.totalTickets,
            imageUrl: ev.imageUrl
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'ticketPrice' || name === 'totalTickets' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all text fields
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'imageUrl') formData.append(key, String(value));
    });
    
    // Append new image if selected
    if (newImage) formData.append('image', newImage);

    try {
      await API.patch(`/events/update/${eventId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Experience updated successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-zinc-500 animate-pulse font-black tracking-widest">LOADING EDITOR...</div>;

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <header className="mb-12">
        <h1 className="text-6xl font-black text-white tracking-tighter">Refine.</h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Modify your published experience</p>
      </header>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Content Editor */}
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Event Title</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">About the Event</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white h-64 focus:border-white/30 outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category</label>
                <input name="category" value={form.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white/30 outline-none" />
            </div>
          </div>
        </div>

        {/* Right Side: Logistics & Media */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[3rem] space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Schedule</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
              <input name="time" type="time" value={form.time} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Availability & Price</label>
              <div className="grid grid-cols-2 gap-3">
                <input name="totalTickets" type="number" value={form.totalTickets} onChange={handleChange} placeholder="Tickets" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
                <input name="ticketPrice" type="number" value={form.ticketPrice} onChange={handleChange} placeholder="Price $" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Event Banner</label>
              {form.imageUrl && !newImage && (
                <div className="rounded-2xl overflow-hidden h-32 border border-white/10">
                    <img src={`http://localhost:3001/uploads/${form.imageUrl}`} className="w-full h-full object-cover grayscale opacity-50" alt="Current" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => e.target.files && setNewImage(e.target.files[0])} className="text-[10px] text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-white file:text-black hover:file:bg-zinc-200" />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-white text-black py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95">
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;