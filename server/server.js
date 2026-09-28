const express = require("express");
const dotenv = require("dotenv");
const stripe = require("stripe")
const path = require("path");

dotenv.config();

const app = express();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});

app.post(
    "/webhook",
    express.raw({type: "application/json"}),
    (req, res) => {
        const signature = req.headers["stripe-signature"];

        let event;

        try {
            event = stripeClient.webhooks.constructEvent(
                req.body,
                signature, 
                process.env.STRIPE_WEBHOOK_SECRET
            )
        } catch (error) {
            console.error("Webhook signature verification failed:");
            console.error(error.message)
            return res.sendStatus(400)
        }
        
        console.log("Webhook received:", event.type);

        // PAYMENT SUCCESSFUL

        if(event.type === "checkout.session.completed"){
            const session = event.data.object;

            console.log("Payment successful!");
            console.log("Session ID:", session.id);
            console.log("Amount:", session.amount_total);
            console.log("Currency:", session.currency);
        }
        res.sendStatus(200);
    }
)

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, email } = req.body;
    
    // Basic validation
    if (!email || !amount) {
      return res.status(400).json({
        error: "Email and amount are required",
      });
    }

    // Make sure the amount is valid
    const amountInCents = Number(amount);

    if (
        !Number.isInteger(amountInCents) || 
        amountInCents < 100 || 
        amountInCents > 100000
    ) {
      return res.status(400).json({
        error: "Invalid donation amount",
      });
    }

    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",

      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: "eur",

            product_data: {
              name: "Don - Association France",
            },

            unit_amount: amountInCents,
          },

          quantity: 1,
        },
      ],

      payment_method_types: ["card"],

      success_url: "https://stripe-donation-sfd7.onrender.com//merci.html",

      cancel_url: "https://stripe-donation-sfd7.onrender.com/",
    });

    res.json({ url: session.url, });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to create payment session",
    });
  }
});

const PORT = process.env.PORT

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at ${PORT}`);
});