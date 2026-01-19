// import React, { useEffect, useState } from 'react';
// import API from '../../api/axios';

// interface EventType {
//   id: number;
//   name: string;
//   date: string;
//   availableTickets: number;
// }

// const DeleteEvent: React.FC = () => {
//   const [events, setEvents] = useState<EventType[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await API.get('/events');
//         setEvents(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleDelete = async (id: number) => {
//     try {
//       await API.post(`/events/cancel/${id}`); // Cancel event API
//       alert('Event deleted/cancelled successfully!');
//       setEvents((prev) => prev.filter((ev) => ev.id !== id));
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Failed to delete event');
//     }
//   };

//   if (loading) return <p>Loading events...</p>;

//   return (
//     <div>
//       <h2>Delete Event</h2>
//       <ul>
//         {events.map((ev) => (
//           <li key={ev.id}>
//             {ev.name} - {ev.date} - {ev.availableTickets} tickets
//             <button onClick={() => handleDelete(ev.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DeleteEvent;















import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

const DeleteEvent: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/events').then(res => setEvents(res.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('This action cannot be undone. Refund users and cancel?')) return;
    try {
      await API.post(`/events/cancel/${id}`);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err: any) { alert('Failed to delete'); }
  };

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading management console...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2rem] mb-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">Danger Zone</h2>
        <p className="text-zinc-400 mt-2 text-sm">Cancel events and trigger automatic refunds for attendees.</p>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-center text-zinc-600 italic py-10">No events found to manage.</p>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="group bg-zinc-900 border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:border-red-500/30 transition-all">
              <div>
                <h3 className="text-white font-bold">{ev.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{ev.date} • {ev.availableTickets} Tickets left</p>
              </div>
              <button 
                onClick={() => handleDelete(ev.id)}
                className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                Cancel Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeleteEvent;