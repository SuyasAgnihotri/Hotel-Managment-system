import { useState, useEffect } from "react";
import apiClient from "../api/client";

export default function CreateBooking({ onBookingCreated }) {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);

  const [formData, setFormData] = useState({
    hotel: "",
    room: "",
    guest: "",
    check_in: "",
    check_out: "",
    total_amount: "",
    source: "direct",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get("/hotels/").then((res) => setHotels(res.data));
    apiClient.get("/rooms/").then((res) => setRooms(res.data));
    apiClient.get("/guests/").then((res) => setGuests(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await apiClient.post("/bookings/", formData);
      setSuccess(`Booking created for room ${res.data.room_number}!`);
      onBookingCreated?.(res.data);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to create booking.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Booking</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <select name="hotel" value={formData.hotel} onChange={handleChange} required>
        <option value="">Select Hotel</option>
        {hotels.map((h) => (
          <option key={h.id} value={h.id}>{h.name}</option>
        ))}
      </select>

      <select name="room" value={formData.room} onChange={handleChange} required>
        <option value="">Select Room</option>
        {rooms.map((r) => (
          <option key={r.id} value={r.id}>Room {r.room_number}</option>
        ))}
      </select>

      <select name="guest" value={formData.guest} onChange={handleChange} required>
        <option value="">Select Guest</option>
        {guests.map((g) => (
          <option key={g.id} value={g.id}>{g.full_name}</option>
        ))}
      </select>

      <input type="date" name="check_in" value={formData.check_in} onChange={handleChange} required />
      <input type="date" name="check_out" value={formData.check_out} onChange={handleChange} required />
      <input type="number" name="total_amount" placeholder="Total amount" value={formData.total_amount} onChange={handleChange} required />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Booking"}
      </button>
    </form>
  );
}