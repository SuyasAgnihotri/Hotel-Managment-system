import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateBooking from "./pages/CreateBooking";
import Guests from "./pages/Guests";
import Rooms from "./pages/Rooms";
import { logout } from "./api/client";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
  const [view, setView] = useState("dashboard");

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const views = {
    dashboard: <Dashboard />,
    create: <CreateBooking onBookingCreated={() => setView("dashboard")} />,
    guests: <Guests />,
    rooms: <Rooms />,
  };

  return (
    <div>
      <nav>
        <button onClick={() => setView("dashboard")}>Dashboard</button>
        <button onClick={() => setView("create")}>New Booking</button>
        <button onClick={() => setView("guests")}>Guests</button>
        <button onClick={() => setView("rooms")}>Rooms</button>
        <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>
      </nav>
      {views[view]}
    </div>
  );
}

export default App;