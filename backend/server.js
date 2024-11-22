// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Endpoint to create a dynamic price and subscription
// app.post('/create-checkout-session', async (req, res) => {
//   const { productName, quantity, duration, currency = 'usd' } = req.body;

//   try {
//     // Step 1: Create a product (if needed)
//     const product = await stripe.products.create({
//       name: productName || 'Custom Subscription',
//     });

//     // Step 2: Create a dynamic price
//     const price = await stripe.prices.create({
//       unit_amount: quantity * 1000, // Example: $10 per unit
//       currency: currency,
//       recurring: {
//         interval: duration, // e.g., 'month', 'year'
//       },
//       product: product.id,
//     });

//     // Step 3: Create a checkout session
//     const session = await stripe.checkout.sessions.create({
//       mode: 'subscription',
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price: price.id,
//           quantity: 1, // Subscriptions generally have quantity 1
//         },
//       ],
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel',
//     });

//     // Send session URL in response
//     res.json({ sessionUrl: session.url });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const subscriptionRoutes = require('./subscriptionRoutes');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Apply CORS middleware
app.use(express.json()); // Parse JSON bodies

app.use(bodyParser.json());
app.use('/api', subscriptionRoutes); // Use the router for subscription endpoints

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
