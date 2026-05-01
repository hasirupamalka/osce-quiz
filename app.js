import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Buzzer from "./Buzzer";

// Connect to your new backend (update this IP/Domain when you host it)
export const socket = io("http://localhost:3001");

/* ---------------- HOME ---------------- */
function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>OSCE QUIZ SYSTEM</h1>
      <h2>Select Your Group</h2>
      <Link to="/group1"><button style={{ margin: "5px" }}>Group 1</button></Link>
      <Link to="/group2"><button style={{ margin: "5px" }}>Group 2</button></Link>
      <Link to="/group3"><button style={{ margin: "5px" }}>Group 3</button></Link>
    </div>
  );
}

/* ---------------- MAIN SCREEN ---------------- */
function MainScreen() {
  const [group, setGroup] = useState("");

  useEffect(() => {
    socket.on("buzzer_update", (data) => {
      setGroup(data.group);
    });

    return () => socket.off("buzzer_update");
  }, []);

  const resetBuzz = () => {
    socket.emit("reset");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>OSCE QUIZ</h1>
      <h2 style={{ color: "red" }}>
        {group ? `${group} buzzed first!` : "Waiting for buzz..."}
      </h2>
      <button onClick={resetBuzz} style={{ fontSize: "20px", marginTop: "20px" }}>
        RESET BUZZER
      </button>
    </div>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/group1" element={<Buzzer group="Group 1" />} />
        <Route path="/group2" element={<Buzzer group="Group 2" />} />
        <Route path="/group3" element={<Buzzer group="Group 3" />} />
        <Route path="/main" element={<MainScreen />} />
      </Routes>
    </Router>
  );
}
