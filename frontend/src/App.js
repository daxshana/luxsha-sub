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


import React, { useState } from 'react';

const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    duration: '1',
    specificDates: [],
    daysType: 'weekdays',
    quantity: '1',
    deliveryTime: 'morning',
  });

  const subscriptionOptions = {
    '1': { priceId: 'price_1QNTKeFDU5aLIEJOQXT6MNhj', label: '1 Month' },
    '3': { priceId: 'price_1QNTKeFDU5aLIEJOH8UVodpO', label: '3 Months' },
    '6': { priceId: 'price_1QNTKeFDU5aLIEJO612rddwS', label: '6 Months' },
    '12': { priceId: 'price_1QNTKeFDU5aLIEJONURliDyj', label: '12 Months' },
  };

  const calculateTotal = () => {
    const pricePerLiter = 200; // Fixed price per liter in LKR
    const quantity = parseInt(formData.quantity);
    const durationInMonths = parseInt(formData.duration);
    const deliveryDaysPerWeek =
      formData.daysType === "weekdays"
        ? 5
        : formData.daysType === "weekends"
        ? 2
        : 7; // Default to 'both' = 7 days per week
  
    // Total delivery days in the selected duration
    const weeksInDuration = durationInMonths * 4; // Approximate 4 weeks in a month
    const totalDeliveryDays = deliveryDaysPerWeek * weeksInDuration;
  
    // Total cost calculation
    return pricePerLiter * quantity * totalDeliveryDays;
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specificDates: value.split(',').map((date) => date.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          priceId: subscriptionOptions[formData.duration].priceId,
          quantity: formData.quantity,
          deliveryMetadata: {
            duration: formData.duration,
            specificDates: formData.specificDates,
            daysType: formData.daysType,
            deliveryTime: formData.deliveryTime,
          },
        }),
      });

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your subscription.');
    }
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
          <label className="block mb-2">Specific Dates (comma-separated)</label>
          <input
            type="text"
            name="specificDates"
            onChange={handleDateChange}
            className="w-full p-2 border rounded"
            placeholder="E.g., 2024-12-25, 2024-12-31"
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
