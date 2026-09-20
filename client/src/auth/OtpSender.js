// Get API base URL from environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function SendOtp(setOtpSent,mail) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/user/send-otp`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email: mail})
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setOtpSent(true);
      return data.data.userId;
    } else {
      console.warn("Server responded with error:", data.message);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}