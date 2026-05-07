"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

export async function startPremiumCheckout() {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error("Stripe nie zostal poprawnie skonfigurowany.");
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) {
    throw new Error("Brak NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID.");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    successUrl: `${baseUrl}/profile?premium=success`,
    cancelUrl: `${baseUrl}/profile?premium=cancelled`,
  });

  if (error) {
    throw new Error(error.message ?? "Nie udalo sie uruchomic checkout Stripe.");
  }
}
