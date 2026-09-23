# Stripe Donation Website

A simple donation website built with **Node.js, Express.js, and Stripe Checkout**.

The application allows users to enter their email address and choose or enter a donation amount. The payment is processed securely through Stripe Checkout, while Stripe webhooks notify the server when a payment is completed.

## Features

* 💳 Stripe Checkout integration
* 💶 Euro donation support
* 📧 Donor email collection
* 💰 Preset donation amounts
* ✍️ Custom donation amount
* 🔔 Stripe webhook integration
* ✅ Payment completion verification
* ❌ Payment cancellation handling
* 🔐 Environment variables for sensitive Stripe credentials

## Technologies

* **HTML5**
* **CSS3**
* **JavaScript**
* **Node.js**
* **Express.js**
* **Stripe API**
* **Stripe Checkout**
* **Stripe Webhooks**
* **dotenv**
* **Nodemon** (development)

## Project Structure

```text
stripe-donation/
│
├── public/
│   ├── index.html
│   └── merci.html
│
├── server/
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## How It Works

The donation process follows this flow:

```text
User
  ↓
Donation Website
  ↓
Create Checkout Session
  ↓
Stripe Checkout
  ↓
Customer completes payment
  ↓
Stripe
  ↓
Stripe Webhook
  ↓
/webhook
  ↓
Server verifies payment event
```

The application does not handle card information directly. Stripe Checkout handles the payment process and any additional authentication required by the customer's bank or card issuer.

## Installation

Clone the repository:

```bash
git clone https://github.com/ifeanyiD/stripe-donation.git
```

Move into the project directory:

```bash
cd stripe-donation
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

Never commit your `.env` file to GitHub.

The `.gitignore` file should contain:

```gitignore
node_modules/
.env
```

## Running the Application

Start the development server:

```bash
npm run dev
```

Or start the application normally:

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## Stripe Webhook Setup

For local development, Stripe CLI can forward Stripe events to the local webhook endpoint.

Start the server:

```bash
npm run dev
```

Then, in another terminal:

```bash
stripe listen --events checkout.session.completed --forward-to localhost:3000/webhook
```

Stripe CLI will provide a webhook signing secret beginning with:

```text
whsec_
```

Add that secret to your `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart the Node.js server after changing `.env`.

## Webhook Event

The application currently listens for:

```text
checkout.session.completed
```

When Stripe sends this event, the server verifies the webhook signature and can process the completed donation.

For example, the server can access:

* Stripe Checkout Session ID
* Donor email
* Donation amount
* Currency
* Payment information

## Test Mode

The application is designed to be developed and tested using Stripe **Test Mode**.

Test mode does not process real donations.

Use your Stripe test API key:

```env
STRIPE_SECRET_KEY=sk_test_...
```

When the application is ready for production, the Stripe account owner can configure the live Stripe credentials.

## Security

Sensitive credentials should never be placed directly inside the source code.

Do not commit:

```text
.env
```

or expose:

```text
sk_test_...
sk_live_...
whsec_...
```

in public repositories.

The Stripe secret key should remain on the server and should never be placed inside frontend JavaScript.

## Future Improvements

Possible future features include:

* Store donations in MongoDB
* Donation history
* Admin dashboard
* Donation statistics
* Donor receipt emails
* Successful/failed payment tracking
* Monthly recurring donations
* Production webhook configuration
* Improved form validation
* Donation confirmation page

## License

This project is currently intended for development and client use.
