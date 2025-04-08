import { ofetch } from 'ofetch';

export const apiClient = ofetch.create({
  baseURL: 'http://localhost:5005',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  credentials: 'include'
});