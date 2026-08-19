import { useEffect, useState } from "react";
import apiClient from "../api/client";

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    id_proof_type: "",
    id_proof_number: "",
  });

  const loadGuests = () => {
    setLoading(true);
    apiClient
      .get("/guests/")
      .then((res) => setGuests(res.data))
      .catch(() => setError("Failed to load guests."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await apiClient.post("/guests/", formData);
      setFormData({ full_name: "", phone: "", email: "", id_proof_type: "", id_proof_number: "" });
      loadGuests();
    } catch (err) {
      const data = err.response?.data;
      const message = data?.detail || (data ? Object.values(data).flat().join(" ") : "Failed to add guest.");
      setFormError(message);
    }
  };

  if (loading) return <p>Loading guests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Guests</h2>

      <form onSubmit={handleSubmit}>
        <h3>Add Guest</h3>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <input name="full_name" placeholder="Full name" value={formData.full_name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input name="email" placeholder="Email (optional)" value={formData.email} onChange={handleChange} />
        <input name="id_proof_type" placeholder="ID type (e.g. aadhaar)" value={formData.id_proof_type} onChange={handleChange} />
        <input name="id_proof_number" placeholder="ID number" value={formData.id_proof_number} onChange={handleChange} />
        <button type="submit">Add Guest</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>ID Proof</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td>{g.full_name}</td>
              <td>{g.phone}</td>
              <td>{g.email || "—"}</td>
              <td>{g.id_proof_type ? `${g.id_proof_type}: ${g.id_proof_number}` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}