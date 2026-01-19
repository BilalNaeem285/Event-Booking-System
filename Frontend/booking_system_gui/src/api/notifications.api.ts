import API from './axios';

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await API.get('/notifications');
  return res.data;
};
