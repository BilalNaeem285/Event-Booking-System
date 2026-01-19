// import React, { useEffect, useState } from 'react';
// import { getMyBookings } from '../../api/bookings.api';
// import axios from '../../api/axios';

// interface Booking {
//   id: number;
//   cancelled: boolean;
//   event: {
//     name: string;
//     date: string;
//     time: string;
//     ticketPrice: number;
//   };
// }

// const MyBookings: React.FC = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const data = await getMyBookings();
//         setBookings(data);
//       } catch (err) {
//         console.error('Failed to load bookings', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleCancel = async (id: number) => {
//     try {
//       await axios.post(`/events/cancel-booking/${id}`);
//       alert('Booking cancelled and refund processed');

//       // mark as cancelled instead of removing
//       setBookings((prev) =>
//         prev.map((b) =>
//           b.id === id ? { ...b, cancelled: true } : b
//         )
//       );
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Failed to cancel booking');
//     }
//   };

//   if (loading) return <p>Loading bookings...</p>;
//   if (bookings.length === 0) return <p>No bookings found</p>;

//   return (
//     <div>
//       <h2>My Bookings</h2>
//       <ul>
//         {bookings.map((b) => (
//           <li key={b.id}>
//             <strong>{b.event.name}</strong> — {b.event.date} {b.event.time} — $
//             {b.event.ticketPrice}

//             {!b.cancelled && (
//               <button onClick={() => handleCancel(b.id)}>
//                 Cancel
//               </button>
//             )}

//             {b.cancelled && (
//               <span style={{ color: 'red', marginLeft: 8 }}>
//                 Cancelled
//               </span>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MyBookings;










import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../../api/bookings.api';
import axios from '../../api/axios';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Original Fetch Logic
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Original Cancel Functionality
  const handleCancel = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      // Points to your original backend endpoint
      await axios.post(`/events/cancel-booking/${id}`);
      alert('Booking cancelled successfully');
      
      // Original state update logic: marking it as cancelled in the list
      setBookings(prev => 
        prev.map(b => b.id === id ? { ...b, cancelled: true } : b)
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-zinc-500 animate-pulse font-black tracking-widest">
      RETRIEVING PASSES...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <header className="mb-12">
        <h1 className="text-6xl font-black text-white tracking-tighter">My Passes.</h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
          Manage your secured event entries
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="glass p-20 rounded-[3rem] text-center border border-dashed border-white/10">
          <p className="text-zinc-500 font-medium italic">You haven't booked any experiences yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((b) => (
            <div 
              key={b.id} 
              className={`relative glass rounded-[2.5rem] overflow-hidden transition-all duration-500 border ${
                b.cancelled ? 'opacity-40 grayscale border-red-900/20' : 'hover:border-white/20 border-white/5'
              }`}
            >
              {/* Decorative Ticket Punch Holes for the "Vibe" */}
              <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#050505] rounded-full border border-white/10 z-10" />
              <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#050505] rounded-full border border-white/10 z-10" />

              <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Event Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      b.cancelled ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {b.cancelled ? 'Cancelled' : 'Confirmed Entry'}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">ID: #{b.id}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white tracking-tight">{b.event.name}</h3>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    <span>📍 {b.event.location}</span>
                    <span>📅 {b.event.date}</span>
                    <span>⏰ {b.event.time}</span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col items-center md:items-end gap-4 min-w-[150px]">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Paid Amount</p>
                    <p className="text-2xl font-mono font-bold text-white">${b.event.ticketPrice}</p>
                  </div>

                  {!b.cancelled && (
                    <button 
                      onClick={() => handleCancel(b.id)}
                      className="w-full md:w-auto px-8 py-3 rounded-2xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      Cancel Entry
                    </button>
                  )}
                  
                  {b.cancelled && (
                    <span className="text-[10px] font-black text-red-900 uppercase tracking-widest">
                      Voided Pass
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;