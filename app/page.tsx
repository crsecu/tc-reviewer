"use client"; // this page uses state, so it runs in the browser

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

    async function handleSubmit() {
        setAnswer(""); // clear the previous answer

        // 1. Send the question to your route (POST, as JSON)
        const res = await fetch("/api/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });

        // 2. Get a reader to pull chunks out of the stream
        const reader = res.body!.getReader(); // `!` tells TS "body won't be null here"
        const decoder = new TextDecoder();

        // 3. Keep pulling chunks until the stream says it's done
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

        const chunk = decoder.decode(value, {stream: true});

        setAnswer(prev => prev + chunk);
        }
    }

  return (
      <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
        <h1 style={{fontWeight: "bold", fontSize: "1.5rem", marginBottom: "16px"}}>T&C Reviewer</h1>
          <div>
              <label htmlFor="textareaTC">Enter your Terms and Conditions text below:</label>
              <textarea id="textareaTC" name="textareaTC" rows={4} cols={50} value = {question} onChange={e => setQuestion(e.target.value)}/>
<br/>
              <button onClick={handleSubmit}>Send</button>
          </div>

          <div><p>{answer}</p></div>
      </main>
  );
}