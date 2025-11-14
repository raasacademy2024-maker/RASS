import React from "react";
import apiClient from "../services/api";

const PaymentPage: React.FC = () => {
  const handlePayment = async () => {
    try {
      // 1️⃣ Create order from backend
      const { data } = await apiClient.post("/payment/order", {
        amount: 500, // INR ₹500
      });

      // 2️⃣ Open Razorpay checkout
      const options: any = {
        key: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_RfTsUpkyueFD5f", // Test Key ID
        amount: data.amount,
        currency: data.currency,
        name: "RASS Academy",
        description: "Course Purchase",
        order_id: data.id,
        handler: async function (response: any) {
          // 3️⃣ Verify payment on backend
          const verifyRes = await apiClient.post("/payment/verify", response);
          if (verifyRes.data.success) {
            alert("✅ Payment Successful! Course Enrolled.");
          } else {
            alert("❌ Payment Verification Failed!");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6366f1", // Indigo
        },
        
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handlePayment}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;