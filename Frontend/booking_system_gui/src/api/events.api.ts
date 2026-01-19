import API from './axios';

export interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  totalTickets: number;
  availableTickets: number;
  ticketPrice: number;
  status: 'UPCOMING' | 'CANCELLED' | 'COMPLETED';
  imageUrl: string; // NEW
  creator: {
    id: string;
  };
}

// GET all upcoming events
export const getEvents = async (): Promise<Event[]> => {
  const res = await API.get('/events');
  return res.data;
};

// CREATE EVENT with image
export const createEvent = async (eventData: FormData) => {
  const res = await API.post('/events/create', eventData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// BOOK a ticket
export const bookEventTicket = async (eventId: number, cardNumber: string) => {
  const res = await API.post(`/events/book/${eventId}`, { cardNumber });
  return res.data;
};

// CANCEL an event
export const cancelEvent = async (eventId: number) => {
  const res = await API.post(`/events/cancel/${eventId}`);
  return res.data;
};

// CANCEL a booking
export const cancelBooking = async (bookingId: number) => {
  const res = await API.post(`/events/cancel-booking/${bookingId}`);
  return res.data;
};
