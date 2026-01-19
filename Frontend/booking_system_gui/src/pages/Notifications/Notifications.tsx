// import React, { useEffect, useState } from 'react';
// import { getNotifications, type Notification } from '../../api/notifications.api';

// const Notifications: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const data = await getNotifications();
//         setNotifications(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   if (loading) return <p>Loading notifications...</p>;
//   if (notifications.length === 0) return <p>No notifications</p>;

//   return (
//     <div>
//       <h2>Notifications</h2>
//       <ul>
//         {notifications.map((n) => (
//           <li key={n.id}>
//             {n.message} - {new Date(n.createdAt).toLocaleString()}
//             {n.read ? ' ✅' : ' ❌'}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Notifications;















import React, { useEffect, useState } from 'react';
import { getNotifications } from '../../api/notifications.api';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then(setNotifications).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-black text-white mb-12 tracking-tighter">Activity.</h2>
      
      {loading ? (
        <div className="glass p-20 text-center rounded-[3rem] animate-pulse">Syncing...</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className={`p-8 rounded-[2rem] border transition-all ${n.read ? 'bg-black/20 border-white/5 opacity-50' : 'glass border-white/20 shadow-lg'}`}>
              <p className="text-white font-medium text-lg leading-snug">{n.message}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  {new Date(n.createdAt).toDateString()}
                </span>
                {!n.read && <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;