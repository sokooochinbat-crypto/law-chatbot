import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch(
        "https://law-chatbot-sokooo.onrender.com/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      // ❗ RESPONSE STATUS ШАЛГАНА
      if (!res.ok) {
        throw new Error("Server error: " + res.status);
      }

      const data = await res.json();

      console.log("API response:", data); // debug

      // ❗ backend format бүх тохиолдлыг handle хийнэ
      if (typeof data === "string") {
        setAnswer(data);
      } else if (data.answer) {
        setAnswer(data.answer);
      } else if (data.result) {
        setAnswer(data.result);
      } else {
        setAnswer(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setAnswer("❌ Алдаа: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>⚖️ Хууль AI Chatbot</h1>

      <textarea
        style={styles.input}
        placeholder="Асуултаа бич..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button style={styles.button} onClick={askQuestion}>
        {loading ? "⏳ Уншиж байна..." : "Асуух"}
      </button>

      {answer && (
        <div style={styles.answerBox}>
          <h3>Хариу:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "Arial",
  },
  input: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  answerBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f2f2f2",
    borderRadius: "10px",
  },
};

export default App;