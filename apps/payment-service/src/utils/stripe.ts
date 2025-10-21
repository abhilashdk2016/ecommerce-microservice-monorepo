import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    apiVersion: "2025-09-30.clover" as any,
});

export default stripe;
