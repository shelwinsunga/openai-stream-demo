import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useState, useEffect } from "react";

const q1 = `Consider HTML5 as an open web platform. What are the building blocks of HTML5?`;
const q2 = `What is progressive rendering?`;
const q3 = `What are empty elements in HTML ?`;

const questions = [q1, q2, q3];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const randomQuestionIndex = Math.floor(Math.random() * questions.length);
    setQuestion(questions[randomQuestionIndex]);
  }, []);


  async function handleSubmit() {
    setResponse("");
    const res = await fetch("/api/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, question }),
    });

    const data = res.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResponse((prev) => prev + chunkValue);
    }
  }

  return (
    <>
      <Head>
        <title>Interview Simulator</title>
        <meta name="description" content="Interview Simulator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}> Interview Simulator </h1>
        <h2
          style={{ color: "#538EFF", fontWeight: "400", marginBottom: "3rem" }}
        >
          Question
        </h2>
        <div className={styles.container}>
          <div className={styles.question}>
            <ReactMarkdown>
              {question}
            </ReactMarkdown>
          </div>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <textarea
              className={styles.input}
              autoComplete="off"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </form>
          {response &&
          (
            <div className={styles.res}>
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
