"use client";

import { useEffect, useMemo, useState } from "react";
import type { Difficulty, Question, Section } from "@/lib/types";
import { KatexText } from "./KatexText";

const LETTERS = ["A", "B", "C", "D"] as const;

function shuffleClient<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Props = {
  questions: Question[];
  section: Section;
  subjectLabel: string;
  unitTitle: string;
};

export function Quiz({ questions, section, subjectLabel, unitTitle }: Props) {
  const topics = useMemo(
    () => Array.from(new Set(questions.map((q) => q.topic))).sort(),
    [questions],
  );
  const [topic, setTopic] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>("all");
  const [limit, setLimit] = useState(20);
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [started, setStarted] = useState(false);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (topic !== "all" && q.topic !== topic) return false;
      if (difficulty !== "all" && q.difficulty !== difficulty) return false;
      return true;
    });
  }, [questions, topic, difficulty]);

  function startSession() {
    const next = shuffleClient(filtered).slice(0, Math.min(limit, filtered.length));
    setDeck(next);
    setIndex(0);
    setChosen(null);
    setCorrectCount(0);
    setAnswered(0);
    setStarted(true);
  }

  useEffect(() => {
    if (!started) return;
    const key = `ap-practice:${questions[0]?.subject}:${questions[0]?.unit}:${section}`;
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ correctCount, answered, at: Date.now() }),
      );
    } catch {
      /* ignore */
    }
  }, [answered, correctCount, questions, section, started]);

  if (!started) {
    return (
      <section className="panel setup">
        <header className="setup-head">
          <p className="eyebrow">{subjectLabel}</p>
          <h1>{unitTitle}</h1>
          <p className="lede">
            {section === "trap" ? "Trap questions" : "Standard practice"} ·{" "}
            {filtered.length} available
          </p>
        </header>
        <div className="filters">
          <label>
            Topic
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="all">All topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "all" | Difficulty)}
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label>
            Questions
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              {[10, 20, 40, 60].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
              <option value={9999}>All ({filtered.length})</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          className="btn primary"
          disabled={filtered.length === 0}
          onClick={startSession}
        >
          Start session
        </button>
      </section>
    );
  }

  if (deck.length === 0) {
    return (
      <section className="panel">
        <p>No questions match these filters.</p>
        <button type="button" className="btn" onClick={() => setStarted(false)}>
          Back
        </button>
      </section>
    );
  }

  const q = deck[index];
  const done = index >= deck.length;
  if (done || !q) {
    const pct = answered ? Math.round((100 * correctCount) / answered) : 0;
    return (
      <section className="panel results">
        <p className="eyebrow">Session complete</p>
        <h1>
          {correctCount} / {answered} correct
        </h1>
        <p className="lede">{pct}% · {unitTitle}</p>
        <div className="actions">
          <button type="button" className="btn primary" onClick={startSession}>
            Practice again
          </button>
          <button type="button" className="btn" onClick={() => setStarted(false)}>
            Change filters
          </button>
        </div>
      </section>
    );
  }

  const revealed = chosen !== null;
  const isCorrect = chosen === q.correct;

  function pick(letter: (typeof LETTERS)[number]) {
    if (chosen !== null) return;
    setChosen(letter);
    setAnswered((n) => n + 1);
    if (letter === q.correct) setCorrectCount((n) => n + 1);
  }

  function next() {
    setChosen(null);
    setIndex((i) => i + 1);
  }

  return (
    <section className="panel quiz">
      <div className="quiz-meta">
        <span>
          {index + 1} / {deck.length}
        </span>
        <span>
          Score {correctCount}/{answered}
        </span>
        <span className="pill">{q.topic}</span>
        <span className="pill">{q.difficulty}</span>
        {section === "trap" && q.trap?.trap_type ? (
          <span className="pill trap">{q.trap.trap_type}</span>
        ) : null}
      </div>

      {q.stimulus && q.stimulus.type !== "none" && q.stimulus.content ? (
        <aside className="stimulus">
          <KatexText text={q.stimulus.content} />
          {q.stimulus.citation ? (
            <cite>{q.stimulus.citation}</cite>
          ) : null}
        </aside>
      ) : null}

      <h2 className="stem">
        <KatexText text={q.question} />
      </h2>

      <div className="options" role="list">
        {LETTERS.map((letter) => {
          const text = q.options[letter];
          let state = "";
          if (revealed) {
            if (letter === q.correct) state = "correct";
            else if (letter === chosen) state = "wrong";
          }
          return (
            <button
              key={letter}
              type="button"
              role="listitem"
              className={`option ${state}`}
              disabled={revealed}
              onClick={() => pick(letter)}
            >
              <span className="letter">{letter}</span>
              <KatexText text={text} />
            </button>
          );
        })}
      </div>

      {revealed ? (
        <div className={`feedback ${isCorrect ? "ok" : "bad"}`}>
          <p className="feedback-title">
            {isCorrect ? "Correct" : `Incorrect — answer is ${q.correct}`}
          </p>
          <p>
            <KatexText text={q.explanation} />
          </p>
          {section === "trap" && q.trap ? (
            <div className="trap-box">
              <p>
                <strong>Trap:</strong> {q.trap.trap_description}
              </p>
              <p>
                <strong>Why it tempts:</strong> {q.trap.why_students_fall_for_it}
              </p>
              <p>
                <strong>How to avoid:</strong> {q.trap.how_to_avoid}
              </p>
            </div>
          ) : null}
          {q.distractor_notes && chosen && chosen !== q.correct ? (
            <p className="note">
              Why {chosen} is wrong:{" "}
              <KatexText text={q.distractor_notes[chosen] || ""} />
            </p>
          ) : null}
          {(q.source?.attribution ||
            q.source?.license ||
            q.verification?.citations?.length) && (
            <p className="attribution">
              {q.source?.attribution || q.source?.name || "Source"}
              {q.source?.license ? ` · ${q.source.license}` : ""}
              {q.verification?.citations?.[0]
                ? ` · ${q.verification.citations[0]}`
                : ""}
            </p>
          )}
          <button type="button" className="btn primary" onClick={next}>
            {index + 1 >= deck.length ? "See results" : "Next question"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
