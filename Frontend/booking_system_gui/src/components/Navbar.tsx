// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const Navbar: React.FC = () => {
//   const { token, userRole, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
//       <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>

//       {!token && (
//         <>
//           <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
//           <Link to="/register" style={{ marginRight: '15px' }}>Sign Up</Link>
//         </>
//       )}

//       {token && userRole === 'USER' && (
//         <>
//           <Link to="/mybookings" style={{ marginRight: '15px' }}>My Bookings</Link>
//           <Link to="/notifications" style={{ marginRight: '15px' }}>Notifications</Link>
//         </>
//       )}

//       {token && userRole === 'CREATOR' && (
//         <>
//           <Link to="/create-event" style={{ marginRight: '15px' }}>Create Event</Link>
//           <Link to="/wallet" style={{ marginRight: '15px' }}>Wallet</Link>
//           <Link to="/notifications" style={{ marginRight: '15px' }}>Notifications</Link>
//         </>
//       )}

//       {token && <button onClick={handleLogout}>Logout</button>}
//     </nav>
//   );
// };

// export default Navbar;















import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { token, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-black tracking-tighter text-white">
          EVENTO<span className="text-zinc-500">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/dashboard" active={isActive('/dashboard')}>Explore</NavLink>
          
          {/* FIXED: Changed to /mybookings to match App.tsx */}
          {token && userRole === 'USER' && (
            <NavLink to="/mybookings" active={isActive('/mybookings')}>My Passes</NavLink>
          )}

          {token && userRole === 'CREATOR' && (
            <>
              <NavLink to="/create-event" active={isActive('/create-event')}>Host</NavLink>
              <NavLink to="/wallet" active={isActive('/wallet')}>Revenue</NavLink>
            </>
          )}
          {token && <NavLink to="/notifications" active={isActive('/notifications')}>Alerts</NavLink>}
        </div>

        <div className="flex items-center gap-4">
          {!token ? (
            <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all">
              Sign In
            </Link>
          ) : (
            <button onClick={() => { logout(); navigate('/login'); }} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) => (
  <Link to={to} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
    {children}
  </Link>
);

export default Navbar;