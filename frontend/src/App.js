// import React, { useState } from 'react';
// import axios from 'axios';

// const Home = () => {
//   const [quantity, setQuantity] = useState(1);
//   const [duration, setDuration] = useState('month'); // Default duration

//   const handleSubscribe = async () => {
//     try {
//       // Sending POST request to create a checkout session
//       const response = await axios.post('http://localhost:5000/create-checkout-session', {
//         productName: 'Custom Subscription',
//         quantity: quantity, // User-selected quantity
//         duration: duration, // User-selected duration ('month', 'year')
//         currency: 'usd',
//       });

//       // Check if the session URL was returned
//       if (response.data.sessionUrl) {
//         window.location.href = response.data.sessionUrl; // Redirect to Stripe Checkout
//       } else {
//         console.error("No session URL returned");
//       }
//     } catch (error) {
//       console.error('Error creating checkout session:', error.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Customize Your Subscription</h1>
//       <label>
//         Quantity:
//         <input
//           type="number"
//           min="1"
//           value={quantity}
//           onChange={(e) => setQuantity(Number(e.target.value))}
//         />
//       </label>
//       <label>
//         Duration:
//         <select value={duration} onChange={(e) => setDuration(e.target.value)}>
//           <option value="month">Monthly</option>
//           <option value="year">Yearly</option>
//         </select>
//       </label>
//       <button onClick={handleSubscribe}>Subscribe Now</button>
//     </div>
//   );
// };

// export default Home;


import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    duration: "1",
    specificDates: [], // Ensure this is initialized as an array
    daysType: "weekdays",
    quantity: "1",
    deliveryTime: "morning",
  });

  const subscriptionOptions = {
    "1": { label: "1 Month" },
    "3": { label: "3 Months" },
    "6": { label: "6 Months" },
    "12": { label: "12 Months" },
    none: { label: "None" }, // Added "None" option
  };

  const calculateTotal = () => {
    const pricePerLiter = 200; // Price per liter in LKR
    const daysInWeek = 7;
    const weekdaysInWeek = 5;
    const quantity = parseInt(formData.quantity, 10);

    if (formData.duration === "none") {
      // Calculate for specific dates
      const selectedDays = Array.isArray(formData.specificDates)
        ? formData.specificDates.length
        : 0; // Safeguard against invalid values
      return selectedDays * quantity * pricePerLiter;
    }

    const durationInMonths = parseInt(formData.duration, 10);
    const weeksInMonth = 4; // Approximation for calculation
    const deliveryDays =
      formData.daysType === "weekdays"
        ? weekdaysInWeek
        : formData.daysType === "weekends"
        ? 2 // Saturdays and Sundays
        : formData.daysType === "none"
        ? 0 // No delivery days
        : daysInWeek;

    return (
      durationInMonths * weeksInMonth * deliveryDays * quantity * pricePerLiter
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (dates) => {
    if (Array.isArray(dates)) {
      setFormData((prev) => ({
        ...prev,
        specificDates: dates, // Set selected dates directly
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data Submitted:", formData);

    alert(`Subscription created! Total Amount: ${calculateTotal()} LKR`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Milk Subscription Checkout
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block mb-2">Subscription Duration</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            {Object.entries(subscriptionOptions).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Specific Dates</label>
          <ReactDatePicker
            selected={null} // For multiple dates, we don't need `selected`
            onChange={handleDateChange}
            inline
            isClearable
            selectsMultiple
            placeholderText="Select multiple dates"
          />
        </div>

        <div>
          <label className="block mb-2">Days Preference</label>
          <select
            name="daysType"
            value={formData.daysType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="both">Both</option>
            <option value="none">None</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Quantity (Liters per delivery)</label>
          <select
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="1">1 Liter</option>
            <option value="2">2 Liters</option>
            <option value="3">3 Liters</option>
            <option value="5">5 Liters</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Delivery Time</label>
          <select
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="morning">Morning (6AM - 9AM)</option>
            <option value="afternoon">Afternoon (2PM - 5PM)</option>
            <option value="evening">Evening (6PM - 9PM)</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">Total Amount:</span>
          <span className="text-xl">{calculateTotal()} LKR</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Proceed to Checkout
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
