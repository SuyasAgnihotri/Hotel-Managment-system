import { useEffect, useState } from "react";
import apiClient from "../api/client";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({ hotel: "", room_type: "", room_number: "", floor: "" });

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      apiClient.get("/rooms/"),
      apiClient.get("/room-types/"),
      apiClient.get("/hotels/"),
    ])
      .then(([roomsRes, typesRes, hotelsRes]) => {
        setRooms(roomsRes.data);
        setRoomTypes(typesRes.data);
        setHotels(hotelsRes.data);
      })
      .catch(() => setError("Failed to load rooms."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await apiClient.post("/rooms/", formData);
      setFormData({ hotel: "", room_type: "", room_number: "", floor: "" });
      loadAll();
    } catch (err) {
      const data = err.response?.data;
      const message = data?.detail || (data ? Object.values(data).flat().join(" ") : "Failed to add room.");
      setFormError(message);
    }
  };

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Rooms</h2>

      <form onSubmit={handleSubmit}>
        <h3>Add Room</h3>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <select name="hotel" value={formData.hotel} onChange={handleChange} required>
          <option value="">Select Hotel</option>
          {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <select name="room_type" value={formData.room_type} onChange={handleChange} required>
          <option value="">Select Room Type</option>
          {roomTypes.map((rt) => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
        </select>
        <input name="room_number" placeholder="Room number" value={formData.room_number} onChange={handleChange} required />
        <input name="floor" placeholder="Floor" type="number" value={formData.floor} onChange={handleChange} />
        <button type="submit">Add Room</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Room #</th>
            <th>Type</th>
            <th>Floor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id}>
              <td>{r.room_number}</td>
              <td>{r.room_type_name}</td>
              <td>{r.floor ?? "—"}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}