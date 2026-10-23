export const isLoggedIn = () => {
    return localStorage.getItem('user') !== null &&
           localStorage.getItem('token') !== null;
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    try {
        return user ? JSON.parse(user) : null;
    } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
    }
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const saveAuth = (userData) => {
    const { token, ...user } = userData;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
};

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user?.role === 'ADMIN';
};
