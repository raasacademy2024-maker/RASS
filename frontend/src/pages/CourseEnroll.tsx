import React from "react";
import axios from "axios";

const CourseEnroll = ({ courseId, course }: any) => {
  const handleEnroll = async () => {
    try {
      // 1️⃣ Create order
      const { data } = await axios.post(
        "https://rass1.onrender.com/api/payment/order",
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const { order } = data;

      // 2️⃣ Razorpay checkout
      const options: any = {
        key: "rzp_test_RJqt4AZALMZEYE",
        amount: order.amount,
        currency: order.currency,
        name: "RAAS Academy",
        description: `Enroll in ${course.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3️⃣ Verify payment
          await axios.post(
            "https://rass1.onrender.com/api/payment/verify",
            { ...response, courseId },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          alert("✅ Payment successful, enrolled!");
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#6366f1" },
        
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to start payment");
    }
  };

  return (
    <button
      onClick={handleEnroll}
      className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
    >
      Enroll Now
    </button>
  );
};

export default CourseEnroll;
