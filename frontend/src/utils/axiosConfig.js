// import axios from 'axios';

// const api = axios.create({
//     baseURL: process.env.REACT_APP_API_URL || '/api',
//     withCredentials: true, // For cross-domain cookies if needed
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// // Request interceptor for auth token
// api.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem('token');

//         // Add token to headers if exists
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         // Add CSRF token if using cookies
//         // const csrfToken = getCSRFToken();
//         // if (csrfToken) config.headers['X-CSRF-TOKEN'] = csrfToken;

//         return config;
//     },
//     error => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;

//         // Handle 401 Unauthorized
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 // Attempt token refresh
//                 const { data } = await axios.post('/auth/refresh-token');
//                 localStorage.setItem('token', data.token);
//                 api.defaults.headers.Authorization = `Bearer ${data.token}`;
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 // Full logout if refresh fails
//                 localStorage.removeItem('token');
//                 window.location.href = '/login?session_expired=1';
//                 return Promise.reject(refreshError);
//             }
//         }

//         // Handle other errors
//         if (error.response?.status === 403) {
//             window.location.href = '/login?error=access_denied';
//         }

//         return Promise.reject(error);
//     }
// );

// // Login helper function
// export const loginUser = async (credentials) => {
//     try {
//         const response = await api.post('/auth/login', credentials);

//         if (response.data.token) {
//             localStorage.setItem('token', response.data.token);
//             api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
//         }

//         return response.data;
//     } catch (error) {
//         handleLoginError(error);
//         throw error;
//     }
// };

// // Error handler
// const handleLoginError = (error) => {
//     const message = error.response?.data?.message || 'Login failed';

//     if (error.response?.status === 401) {
//         throw new Error('Invalid email or password');
//     }

//     if (error.response?.status === 429) {
//         throw new Error('Too many attempts. Try again later');
//     }

//     throw new Error(message);
// };

// export default api;


import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true // For cookies
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    // Add token to headers if exists
    if (token) {
        console.log('Adding token to request headers');
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('No token found in localStorage');
    }

    return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Attempting token refresh');
            originalRequest._retry = true;

            try {
                const response = await axios.post('/auth/refresh-token');
                const newToken = response.data.token;
                localStorage.setItem('token', newToken);
                api.defaults.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;