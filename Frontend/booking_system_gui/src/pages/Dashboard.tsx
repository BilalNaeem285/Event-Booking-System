// import React, { useEffect, useState, useContext } from 'react';
// import { getEvents } from '../api/events.api';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import API from '../api/axios';

// interface Event {
//   id: number;
//   name: string;
//   description: string;
//   category: string;
//   location: string;
//   date: string;
//   time: string;
//   ticketPrice: number;
//   availableTickets: number;
//   imageUrl: string;
//   creator: {
//     id: string;
//   };
// }

// const Dashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { userRole, userId } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const data = await getEvents();
//         setEvents(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleBook = async (eventId: number) => {
//     const cardNumber = prompt('Enter your card number (16 digits):');
//     if (!cardNumber) return;

//     try {
//       await API.post(`/events/book/${eventId}`, { cardNumber });
//       alert('Ticket booked successfully!');

//       setEvents((prev) =>
//         prev.map((e) =>
//           e.id === eventId
//             ? { ...e, availableTickets: e.availableTickets - 1 }
//             : e
//         )
//       );
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Booking failed');
//     }
//   };

//   const handleDelete = async (eventId: number) => {
//     try {
//       await API.post(`/events/cancel/${eventId}`);
//       alert('Event deleted successfully!');
//       setEvents((prev) => prev.filter((e) => e.id !== eventId));
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Failed to delete event');
//     }
//   };

//   if (loading) return <p>Loading events...</p>;
//   if (events.length === 0) return <p>No upcoming events</p>;

//   return (
//     <div>
//       <h2>Upcoming Events</h2>
//       {events.map((event) => (
//         <div
//           key={event.id}
//           style={{
//             border: '1px solid #ccc',
//             marginBottom: 15,
//             padding: 10,
//             display: 'flex',
//             gap: 15,
//           }}
//         >
//           <img
//             src={`http://localhost:3001/uploads/${event.imageUrl}`}
//             alt={event.name}
//             style={{ width: 150, height: 100, objectFit: 'cover' }}
//           />
//           <div>
//             <h3>{event.name}</h3>
//             <p>{event.description}</p>
//             <p>
//               {event.category} | {event.location}
//             </p>
//             <p>
//               {event.date} {event.time}
//             </p>
//             <p>Price: ${event.ticketPrice}</p>
//             <p>Available Tickets: {event.availableTickets}</p>

//             {/* USER BOOKING */}
//             {userRole === 'USER' && event.availableTickets > 0 && (
//               <button onClick={() => handleBook(event.id)}>Book Ticket</button>
//             )}

//             {userRole === 'USER' && event.availableTickets === 0 && (
//               <span style={{ color: 'red' }}>Sold Out</span>
//             )}

//             {/* CREATOR: ONLY OWN EVENTS */}
//             {userRole === 'CREATOR' && event.creator.id === userId && (
//               <>
//                 <button onClick={() => handleDelete(event.id)}>Delete Event</button>
//                 <button onClick={() => navigate(`/update-event/${event.id}`)} style={{ marginLeft: 10 }}>Update</button>
//               </>
//             )}

//             {userRole === 'CREATOR' && event.creator.id !== userId && (
//               <span style={{ color: 'gray' }}>You cannot modify this event</span>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;






import React, { useEffect, useState, useContext } from 'react';
import { getEvents } from '../api/events.api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userRole, userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  const handleBook = async (eventId: number) => {
    const cardNumber = prompt('Enter your card number (16 digits):');
    if (!cardNumber) return;
    try {
      await API.post(`/events/book/${eventId}`, { cardNumber });
      alert('Ticket booked successfully!');
      setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, availableTickets: e.availableTickets - 1 } : e));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleDelete = async (eventId: number) => {
    try {
      await API.post(`/events/cancel/${eventId}`);
      alert('Event deleted successfully!');
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-zinc-500 animate-pulse font-black tracking-widest">LOADING EXPERIENCES...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-16">
        <h1 className="text-6xl font-black text-gradient tracking-tighter">Upcoming.</h1>
        <p className="text-zinc-500 text-lg mt-2">Discover and book the best experiences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {events.map((event) => (
          <div key={event.id} className="group glass rounded-[2.5rem] overflow-hidden hover:scale-[1.02] transition-all duration-500 border border-white/5 hover:border-white/20">
            <div className="relative h-64 overflow-hidden">
              <img src={`http://localhost:3001/uploads/${event.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute top-6 left-6 glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{event.category}</span>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
              <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{event.description}</p>
              
              <div className="space-y-1 mb-6 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <p>📍 {event.location}</p>
                <p>📅 {event.date} {event.time}</p>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-white/5 mb-8">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Price</p>
                    <p className="text-xl font-mono font-bold text-white">${event.ticketPrice}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Availability</p>
                    <p className="text-sm font-bold text-white">{event.availableTickets} left</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {userRole === 'USER' && event.availableTickets > 0 && (
                  <button onClick={() => handleBook(event.id)} className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all">Book Ticket</button>
                )}
                {userRole === 'USER' && event.availableTickets === 0 && (
                  <span className="w-full text-center py-4 bg-zinc-900 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest">Sold Out</span>
                )}
                {userRole === 'CREATOR' && event.creator.id === userId ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(event.id)} className="flex-1 bg-red-500/10 text-red-500 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Delete</button>
                    <button onClick={() => navigate(`/update-event/${event.id}`)} className="flex-1 glass text-white py-3 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Update</button>
                  </div>
                ) : userRole === 'CREATOR' && (
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center">Read Only Access</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;