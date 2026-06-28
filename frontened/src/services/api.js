import axios from 'axios';

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// USER APIs
export const registerUser = (data) =>
    api.post('/users/register', data);

export const loginUser = (data) =>
    api.post('/users/login', data);

export const getUserById = (id) =>
    api.get(`/users/${id}`);

export const getAllUsers = () =>
    api.get('/users/all');

export const updateUserProfile = (id, data) =>
    api.put(`/users/profile/${id}`, data);

export const deleteUser = (id) =>
    api.delete(`/users/${id}`);

// MENTOR APIs
export const registerMentor = (data) =>
    api.post('/mentors/register', data);

export const loginMentor = (data) =>
    api.post('/mentors/login', data);

export const getAllMentors = () =>
    api.get('/mentors/all');

export const getMentorById = (id) =>
    api.get(`/mentors/${id}`);

export const searchMentorBySkill = (skill) =>
    api.get('/mentors/search', { params: { skill } });

export const updateMentorProfile = (id, data) =>
    api.put(`/mentors/profile/${id}`, data);

export const deleteMentor = (id) =>
    api.delete(`/mentors/${id}`);

// SLOT APIs
export const addSlot = (mentorId, data) =>
    api.post(`/slots/add/${mentorId}`, data);

export const getAvailableSlots = (mentorId) =>
    api.get(`/slots/available/${mentorId}`);

// BOOKING APIs
export const createBooking = (userId, mentorId, slotId) =>
    api.post('/bookings/create', null, { params: { userId, mentorId, slotId } });

export const getUserBookings = (userId) =>
    api.get(`/bookings/user/${userId}`);

export const getMentorBookings = (mentorId) =>
    api.get(`/bookings/mentor/${mentorId}`);

export const getAllBookings = () =>
    api.get('/bookings/all');

export const updateBookingStatus = (bookingId, status) =>
    api.put(`/bookings/status/${bookingId}`, null, { params: { status } });

export const registerCollege = (data) =>
    api.post('/colleges/register', data);

export const loginCollege = (data) =>
    api.post('/colleges/login', data);

export const getAllColleges = () =>
    api.get('/colleges/all');

export const getCollegeById = (id) =>
    api.get(`/colleges/${id}`);

export const upgradeCollegePlan = (id, plan, expiry) =>
    api.put(`/colleges/upgrade/${id}`, null, { params: { plan, expiry } });

export const deleteCollege = (id) =>
    api.delete(`/colleges/${id}`);

export const bookCollegeSession = (collegeId, mentorId, data) =>
    api.post(`/colleges/${collegeId}/sessions/book/${mentorId}`, data);

export const getCollegeSessions = (collegeId) =>
    api.get(`/colleges/${collegeId}/sessions`);

export const getAllCollegeSessions = () =>
    api.get('/colleges/sessions/all');

export const updateCollegeSessionStatus = (sessionId, status) =>
    api.put(`/colleges/sessions/${sessionId}/status`, null, { params: { status } });

export const addCollegeSessionQuestions = (sessionId, questions) =>
    api.put(`/colleges/sessions/${sessionId}/questions`, null, { params: { questions } });

export const createCollegePayment = (collegeId, plan) =>
    api.post(`/colleges/${collegeId}/payment/create`, null, { params: { plan } });

export const confirmCollegePayment = (collegeId, plan, paymentId) =>
    api.post(`/colleges/${collegeId}/payment/success`, null, { params: { plan, paymentId } });

export const getMentorCollegeSessions = (mentorId) =>
    api.get(`/mentors/${mentorId}/college-sessions`);

export const confirmCollegeSession = (sessionId) =>
    api.put(`/colleges/sessions/${sessionId}/confirm`);

export const completeCollegeSession = (sessionId) =>
    api.put(`/colleges/sessions/${sessionId}/complete`);

export const uploadFile = (formData) =>
    api.post('/files/upload', formData);

export default api;
