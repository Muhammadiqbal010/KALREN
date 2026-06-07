import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

export const loginAdmin = async (username, password) => {
    try {
        // Karena FastAPI pake OAuth2PasswordRequestForm, 
        // kita harus kirim datanya pake format FormData
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post(`${API_URL}/login`, formData);
        
        if (response.data.access_token) {
            // Simpan token dan role ke localStorage biar gak hilang pas di-refresh
            localStorage.setItem('kalren_token', response.data.access_token);
            localStorage.setItem('kalren_role', response.data.role);
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Login gagal';
    }
};