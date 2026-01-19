import axios from './axios';

export const getMyBookings = async () => {
  const res = await axios.get('/events/my-bookings');
  return res.data;
};
