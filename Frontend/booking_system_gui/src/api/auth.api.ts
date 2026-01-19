import API from './axios';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'CREATOR';
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await API.post('/auth/login', payload);
  return response.data; // { accessToken: string }
};

export const registerUser = async (payload: RegisterPayload) => {
  const response = await API.post('/auth/register', payload);
  return response.data; // { message: string }
};
