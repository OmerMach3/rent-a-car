export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Convert to boolean
  };