import { useEffect, useState } from "react";
import apiClient from "../api/client";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadBookings = () => {
    setLoading(true);
    apiClient
      .get("/bookings/")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCheckIn = async (id) => {
    setActionError("");
    try {
      await apiClient.post(`/bookings/${id}/check_in/`);
      loadBookings();
    } catch (err) {
      setActionError(err.response?.data?.detail || "Check-in failed.");
    }
  };

  const handleCheckOut = async (id) => {
    setActionError("");
    try {
      await apiClient.post(`/bookings/${id}/check_out/`);
      loadBookings();
    } catch (err) {
      setActionError(err.response?.data?.detail || "Check-out failed.");
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Bookings</h2>
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.guest_name}</td>
              <td>{b.room_number}</td>
              <td>{b.check_in}</td>
              <td>{b.check_out}</td>
              <td>{b.status}</td>
              <td>₹{b.total_amount}</td>
              <td>
                {b.status === "confirmed" && (
                  <button onClick={() => handleCheckIn(b.id)}>Check In</button>
                )}
                {b.status === "checked_in" && (
                  <button onClick={() => handleCheckOut(b.id)}>Check Out</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}