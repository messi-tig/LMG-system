import axios from "axios";

const API_BASE_URL = "http://localhost:3000/customer"; // adjust to your NestJS backend URL

// ===========================================================
// REGISTER CUSTOMER
// ===========================================================
export async function registerCustomer(formData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept-Language": "en", // or dynamically set based on user
      },
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error.response?.data || error;
  }
}

// ===========================================================
// LOGIN CUSTOMER
// ===========================================================
export async function loginCustomer(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, payload, {
      headers: {
        "Accept-Language": "en",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data || error;
  }
}

// ===========================================================
// LOGOUT CUSTOMER (frontend only)
// ===========================================================
export function logoutCustomer() {
  localStorage.removeItem("token");
  localStorage.removeItem("customer");
}