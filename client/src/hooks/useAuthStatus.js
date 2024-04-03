const useAuthStatus = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export default useAuthStatus;
