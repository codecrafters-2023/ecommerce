// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const preloadedState = {
  auth: {
    userInfo: localStorage.getItem('token') ? 
      { token: localStorage.getItem('token') } : null
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  preloadedState
});