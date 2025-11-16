import { authFetch } from './authAPI';

const BASE = '/api/payment';

/**
 * POST /api/payment/create
 * Body: { amount (in paise), currency, eventId }
 */
export async function createPaymentOrder({ eventId, amountInRupees, currency = 'INR' }) {
  if (!eventId) throw new Error('eventId is required');
  if (!amountInRupees || amountInRupees <= 0) throw new Error('amount must be > 0');

  return await authFetch(`${BASE}/create`, {
    method: 'POST',
    body: {
      amount: Math.round(amountInRupees * 100), // rupees -> paise
      currency,
      eventId,
    },
  });
}

/**
 * POST /api/payment/verify
 * Body:
 * {
 *   razorpay_order_id,
 *   razorpay_payment_id,
 *   razorpay_signature
 * }
 */
export async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  return await authFetch(`${BASE}/verify`, {
    method: 'POST',
    body: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    },
  });
}
