import { useEffect, useState } from "react";
import { socket } from "./App";

export default function Buzzer({ group }) {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    socket.on("buzzer_update", (data) => {
      setIsLocked(data.locked);
    });

    return () => socket.off("buzzer_update");
  }, []);

  const handleBuzz = () => {
    if (isLocked) {
      alert("Already answered!");
      return;
    }
    socket.emit("buzz", group);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>{group}</h1>
      <button
        onClick={handleBuzz}
        disabled={isLocked}
        style={{
          fontSize: "30px",
          padding: "20px",
          backgroundColor: isLocked ? "gray" : "red",
          color: "white",
          cursor: isLocked ? "not-allowed" : "pointer"
        }}
      >
        {isLocked ? "LOCKED" : "BUZZ"}
      </button>
    </div>
  );
}
