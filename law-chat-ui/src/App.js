import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  // 🔐 AUTH STATE
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 💬 CHAT STATE
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  // 📥 HISTORY LOAD
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/history")
      .then((res) => {
        setHistory(Array.isArray(res.data.history) ? res.data.history : []);
      })
      .catch(() => setHistory([]));
  }, []);

  // 🔐 LOGIN
  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

    } catch (err) {
      alert("Login failed");
    }
  };

  // 📝 REGISTER
  const register = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/register", {
        username,
        password
      });

      alert("Registered!");

    } catch (err) {
      alert("User exists");
    }
  };

  // 💬 SEND MESSAGE
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        { message },
        {
          headers: {
            Authorization: token
          }
        }
      );

      const newItem = {
        question: message,
        answer: res.data.reply,
      };

      setHistory((prev) => [...prev, newItem]);
      setMessage("");

    } catch (err) {
      console.error(err);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>

      <h1>⚖️ Law Chatbot</h1>

      {/* LOGIN */}
      {!token && (
        <>
          <h3>Login</h3>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br /><br />

          <button onClick={login}>Login</button>
          <button onClick={register}>Register</button>
        </>
      )}

      {/* CHAT */}
      {token && (
        <>
          <button onClick={logout}>Logout</button>

          <div style={{ marginTop: "20px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Асуулт бич..."
              style={{ width: "70%", padding: "8px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button onClick={sendMessage}>Send</button>
          </div>

          {/* HISTORY */}
          <div style={{ marginTop: "20px" }}>
            {Array.isArray(history) && history.map((item, index) => (
              <div key={index}>

                <div style={{ textAlign: "right" }}>
                  <span style={{
                    background: "#007bff",
                    color: "white",
                    padding: "8px",
                    borderRadius: "10px"
                  }}>
                    {item.question}
                  </span>
                </div>

                <div style={{ textAlign: "left", marginBottom: "10px" }}>
                  <span style={{
                    background: "#eee",
                    padding: "8px",
                    borderRadius: "10px"
                  }}>
                    {item.answer}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}

export default App;