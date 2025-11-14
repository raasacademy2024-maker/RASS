// backend/routes/payment.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { authenticate } from "../middleware/auth.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Event from "../models/Event.js";
import EnrollmentForm from "../models/EnrollmentForm.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RfTsUpkyueFD5f",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "Exo6CLjZ3ewR1uCe45o1QPB8",
});

// ----------------------
// Create Order for Course
// ----------------------
router.post("/order", authenticate, async (req, res) => {
  try {
    console.log("=== Create Payment Order Request ===");
    console.log("User ID:", req.user._id);
    console.log("Course ID:", req.body.courseId);
    
    const { courseId } = req.body;
    
    if (!courseId) {
      console.log("Course ID is missing");
      return res.status(400).json({ message: "Course ID is required" });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found:", courseId);
      return res.status(404).json({ message: "Course not found" });
    }
    
    console.log("Course found:", course.title, "Price:", course.price);

    const options = {
      amount: course.price * 100, // INR → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created successfully:", order.id);
    
    res.json({ order, course });
  } catch (err) {
    console.error("Error creating order:", err);
    console.error("Error details:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      message: "Error creating order", 
      error: err.message || "Unknown error"
    });
  }
});

// ----------------------
// Create Order for Event
// ----------------------
router.post("/event-order", authenticate, async (req, res) => {
  try {
    console.log("=== Create Event Payment Order Request ===");
    console.log("User ID:", req.user._id);
    console.log("Event ID:", req.body.eventId);
    
    const { eventId } = req.body;
    
    if (!eventId) {
      console.log("Event ID is missing");
      return res.status(400).json({ message: "Event ID is required" });
    }
    
    const event = await Event.findById(eventId);
    if (!event) {
      console.log("Event not found:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("Event found:", event.title, "Type:", event.type, "Price:", event.price);

    // Only paid events can have orders
    if (event.type !== "Paid") {
      console.log("Event is not paid type:", event.type);
      return res.status(400).json({ message: "Only paid events can have payment orders" });
    }

    const options = {
      amount: event.price * 100, // INR → paise
      currency: "INR",
      receipt: `event_receipt_${Date.now()}`,
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created successfully:", order.id);
    
    res.json({ order, event });
  } catch (err) {
    console.error("Error creating event order:", err);
    console.error("Error details:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      message: "Error creating event order", 
      error: err.message || "Unknown error"
    });
  }
});

// ----------------------
// Verify Payment for Course
// ----------------------
router.post("/verify", authenticate, async (req, res) => {
  try {
    console.log("=== Payment Verification Started ===");
    console.log("User ID:", req.user._id);
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      console.log("Missing required fields");
      return res.status(400).json({ 
        message: "Missing required payment fields",
        required: ["razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "courseId"],
        provided: { razorpay_order_id: !!razorpay_order_id, razorpay_payment_id: !!razorpay_payment_id, razorpay_signature: !!razorpay_signature, courseId: !!courseId }
      });
    }

    console.log("Payment data:", { razorpay_order_id, razorpay_payment_id, courseId });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Body for signature verification:", body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "LhCRU1mwpEJJRP19te0lv8q0")
      .update(body)
      .digest("hex");
    console.log("Expected signature:", expectedSignature);
    console.log("Received signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.log("Payment verification failed: signature mismatch");
      console.log("Body used for signature:", body);
      console.log("Key secret used:", process.env.RAZORPAY_KEY_SECRET || "LhCRU1mwpEJJRP19te0lv8q0");
      return res.status(400).json({ 
        message: "Payment verification failed - signature mismatch",
        received: razorpay_signature,
        expected: expectedSignature,
        body: body
      });
    }

    console.log("Signature verified successfully");

    const course = await Course.findById(courseId).populate('modules');
    if (!course) {
      console.log("Course not found:", courseId);
      return res.status(404).json({ message: "Course not found" });
    }
    console.log("Course found:", course.title);
    console.log("Course modules count:", course.modules?.length || 0);
    console.log("Course curriculum count:", course.curriculum?.length || 0);
    
    // Log module details for debugging
    if (course.modules && course.modules.length > 0) {
      console.log("Module details:", course.modules.map(m => ({
        id: m._id,
        title: m.title,
        order: m.order
      })));
    }

    // ✅ Check if already enrolled
    let enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    console.log("Existing enrollment:", enrollment);

    if (!enrollment) {
      try {
        console.log("Creating new enrollment for course with modules:", course.modules?.length || 0);
        
        // Create progress data with validation
        let progressData = [];
        if (course.modules && Array.isArray(course.modules)) {
          console.log("Processing modules for progress tracking");
          progressData = course.modules
            .filter(module => module && module._id) // Filter out any invalid modules
            .map(module => ({
              moduleId: module._id,
              completed: false,
              watchTime: 0,
            }));
          console.log("Progress data created with", progressData.length, "items");
        } else {
          console.log("No valid modules found for progress tracking");
        }
        
        // Also check curriculum for progress tracking as fallback
        if (progressData.length === 0 && course.curriculum && Array.isArray(course.curriculum)) {
          console.log("Processing curriculum for progress tracking");
          progressData = course.curriculum
            .filter(item => item && item._id) // Filter out any invalid curriculum items
            .map(item => ({
              moduleId: item._id,
              completed: false,
              watchTime: 0,
            }));
          console.log("Progress data from curriculum created with", progressData.length, "items");
        }

        // Create full enrollment with progress
        enrollment = new Enrollment({
          student: req.user._id,
          course: courseId,
          progress: progressData,
          paymentStatus: "completed",
          paymentId: razorpay_payment_id,
        });
        console.log("Enrollment object created");

        await enrollment.save();
        console.log("Enrollment saved successfully");

        // Update course count
        course.enrollmentCount += 1;
        await course.save();
        console.log("Course enrollment count updated");

        // Add course to user's enrolled courses
        req.user.enrolledCourses.push(courseId);
        await req.user.save();
        console.log("User enrolled courses updated");
      } catch (enrollmentError) {
        console.error("Error creating enrollment:", enrollmentError);
        console.error("Enrollment error stack:", enrollmentError.stack);
        // Send more detailed error information
        if (enrollmentError.name === 'ValidationError') {
          console.error("Validation error details:", enrollmentError.errors);
          return res.status(400).json({ 
            message: 'Validation error in enrollment creation', 
            details: enrollmentError.message,
            errors: Object.keys(enrollmentError.errors || {})
          });
        }
        return res.status(500).json({ 
          message: "Error creating enrollment", 
          error: enrollmentError.message,
          stack: process.env.NODE_ENV === 'development' ? enrollmentError.stack : undefined
        });
      }
    }

    // Update enrollment form payment status if it exists
    try {
      const updatedForms = await EnrollmentForm.updateMany(
        { student: req.user._id, course: courseId },
        { paymentStatus: "completed" }
      );
      console.log("Enrollment forms updated:", updatedForms.modifiedCount);
    } catch (formError) {
      console.log("Could not update enrollment form payment status:", formError);
      // This is not critical, so we continue
    }

    console.log("=== Payment Verification Completed Successfully ===");
    res.json({ success: true, message: "Payment verified & student enrolled!", enrollment });
  } catch (err) {
    console.error("Payment verification error:", err);
    console.error("Payment verification error stack:", err.stack);
    res.status(500).json({ message: "Error verifying payment: " + err.message });
  }
});

// ----------------------
// Verify Payment for Event
// ----------------------
router.post("/verify-event", authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Event payment verification - Body:", body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "LhCRU1mwpEJJRP19te0lv8q0")
      .update(body)
      .digest("hex");
    console.log("Event payment verification - Expected signature:", expectedSignature);
    console.log("Event payment verification - Received signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.log("Event payment verification failed: signature mismatch");
      return res.status(400).json({ 
        success: false, 
        message: "Event payment verification failed - signature mismatch",
        received: razorpay_signature,
        expected: expectedSignature,
        body: body
      });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Return success without adding to attendees - that will be done in the registration step
    res.json({ 
      success: true, 
      message: "Event payment verified successfully!", 
      paymentId: razorpay_payment_id
    });
  } catch (err) {
    console.error("Error verifying event payment:", err);
    res.status(500).json({ success: false, message: "Error verifying event payment" });
  }
});

export default router;