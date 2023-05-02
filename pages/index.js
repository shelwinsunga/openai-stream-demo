import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useState, useEffect } from "react";

const q1 = `Consider HTML5 as an open web platform. What are the building blocks of HTML5?`;
const q2 = `What is progressive rendering?`;
const q3 = `What are empty elements in HTML ?`;
const q4 = "What did you learn yesterday/this week?";
const q5 = "What excites or interests you about coding?";
const q6 = "What is a recent technical challenge you experienced and how did you solve it?";
const q7 = "When building a new web site or maintaining one, can you explain some techniques you have used to increase performance?";
const q8 = "Can you describe some SEO best practices or techniques you have used lately?";
const q9 = "Can you explain any common techniques or recent issues solved in regards to front-end security?";
const q10 = "What actions have you personally taken on recent projects to increase maintainability of your code?";
const q11 = "Talk about your preferred development environment.";
const q12 = "Which version control systems are you familiar with?";
const q13 = "Can you describe your workflow when you create a web page?";
const q14 = "If you have 5 different stylesheets, how would you best integrate them into the site?";
const q15 = "Can you describe the difference between progressive enhancement and graceful degradation?";
const q16 = "How would you optimize a website's assets/resources?";
const q17 = "How many resources will a browser download from a given domain at a time?";
const q18 = "What are the exceptions?";
const q19 = "Name 3 ways to decrease page load (perceived or actual load time).";
const q20 = "If you jumped on a project and they used tabs and you used spaces, what would you do?";

const questions = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20];

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
