import axios from 'axios';

// Створення екземпляру axios з базовою URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // URL нашого API
  headers: {
    'Content-Type': 'application/json'
  }
});

// Додаємо перехоплювач для обробки помилок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обробка помилок автентифікації
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;