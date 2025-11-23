import React, { useState } from "react";
import { toast } from "react-toastify";
import { createPaymentOrder } from "../api/paymentAPI";

function DonateButton({ actorId, eventId, clickable, name, email, contact, orgId }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null); // number | "custom"
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fixedAmounts = [100, 200, 500, 1000];

  // First click just opens the amount options
  const handleMainClick = () => {
    if (!clickable) return;
    setShowOptions((prev) => !prev);
  };

  // Start Razorpay payment for a given amount (in rupees)
    const startPayment = async (amountInRupees) => {
    if (!amountInRupees || amountInRupees <= 0) {
        toast.error('Please enter a valid amount');
        return;
    }
    if (!window.Razorpay) {
        toast.error('Payment SDK not loaded');
        return;
    }

    try {
        setLoading(true);

        const { orderId, amount, currency, key } = await createPaymentOrder({
          eventId,
          orgId,
          amountInRupees,
        });

        const options = {
        key,
        amount,
        currency,
        name: 'CoSpace',
        description: `Donation of ₹${amountInRupees}`,
        order_id: orderId,
        prefill: {
            name: name || 'Test User',
            email: email || 'test@example.com',
            contact: contact || '9999999999',
        },
        notes: { actorId, eventId },
        handler: function (response) {
            console.log('Payment success:', response);
            toast.success('Payment successful!');
        },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');
        });
        rzp.open();
    } catch (err) {
        console.error(err);
        toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
    };

  const handlePayClick = () => {
    let finalAmount;

    if (selectedAmount === "custom") {
      finalAmount = Number(customAmount);
    } else {
      finalAmount = Number(selectedAmount);
    }

    startPayment(finalAmount);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Main button */}
      <button
        className="primary-btn"
        onClick={handleMainClick}
        disabled={!clickable || loading}
        type="button"
      >
        {loading ? "Processing..." : "Donate"}
      </button>

      {/* Dropdown panel with options */}
      {showOptions && (
        <div
          style={{
            position: "absolute",
            marginTop: 8,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 10,
            minWidth: 200,
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: 600 }}>
            Choose amount (₹)
          </div>

          {/* Fixed amounts */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 10,
            }}
          >
            {fixedAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border:
                    selectedAmount === amt
                      ? "2px solid #3399cc"
                      : "1px solid #ccc",
                  background:
                    selectedAmount === amt ? "#e6f5fb" : "transparent",
                  cursor: "pointer",
                }}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          {/* Custom option */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 14 }}>
              <input
                type="radio"
                checked={selectedAmount === "custom"}
                onChange={() => setSelectedAmount("custom")}
                style={{ marginRight: 4 }}
              />
              Custom amount
            </label>
            {selectedAmount === "custom" && (
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  display: "block",
                  marginTop: 6,
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
            )}
          </div>

          {/* Pay button */}
          <button
            onClick={handlePayClick}
            disabled={loading || !selectedAmount}
            className="primary-btn"
            type="button"
          >
            {loading ? "Starting payment..." : "Pay"}
          </button>
        </div>
      )}
    </div>
  );
}

export default DonateButton;