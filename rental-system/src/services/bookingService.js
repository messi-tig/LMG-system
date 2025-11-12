import axios from "axios";

const API_URL = "http://localhost:3000/booking"; // change if your NestJS URL differs

export async function createBooking(form, token, lang) {
  try {
    const response = await axios.post(
      `${API_URL}/create`,
      {
        assetName: form.assetName,
        merchantEmail: form.merchantEmail,
        startDate: form.startDate,
        endDate: form.endDate,
        timeInterval: form.timeInterval,
        numberOfProperty: form.numberOfProperty,
        securityDeposit: form.securityDeposit,
        lang: lang,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Booking API error:", error.response?.data || error.message);
    throw error;
  }
}
