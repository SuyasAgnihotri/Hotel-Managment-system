import { useState, useEffect } from "react";
import apiClient from "../api/client";

export default function AvailabilitySearch() {
  const [hotels, setHotels] = useState([]);
  const [hotel, setHotel] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get("/hotels/").then((res) => setHotels(res.data));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiClient.get("/rooms/available/", {
        params: { hotel, check_in: checkIn, check_out: checkOut },
      });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Search failed.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Check Availability</h2>
      <form onSubmit={handleSearch}>
        <select value={hotel} onChange={(e) => setHotel(e.target.value)} required>
          <option value="">Select Hotel</option>
          {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results && (
        <div>
          <h3>{results.length} room(s) available</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr><th>Room #</th><th>Type</th><th>Floor</th></tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.room_number}</td>
                  <td>{r.room_type_name}</td>
                  <td>{r.floor ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}