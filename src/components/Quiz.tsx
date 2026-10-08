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
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [revealed, setRevealed] = useState(false);
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
    const next = shuffleClient(filtered).slice(
      0,
      Math.min(limit, filtered.length),
    );
    setDeck(next);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
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
          <p className="kicker">{subjectLabel}</p>
          <h1 style={{ fontSize: "1.65rem" }}>{unitTitle}</h1>
          <p className="lede">
            {section === "trap" ? "Trap drills" : "Practice"} ·{" "}
            {filtered.length.toLocaleString()} questions available
          </p>
        </header>
        <div className="filters">
          <label className="field">
            <span>Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="all">All topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Difficulty</span>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "all" | Difficulty)
              }
            >
              <option value="all">All levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label className="field">
            <span>Session length</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[10, 20, 40, 60].map((n) => (
                <option key={n} value={n}>
                  {n} questions
                </option>
              ))}
              <option value={9999}>All ({filtered.length})</option>
            </select>
          </label>
        </div>
        <div className="setup-foot">
          <p className="hint">
            Choose an answer, then check it. Explanations unlock after each
            check.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            disabled={filtered.length === 0}
            onClick={startSession}
          >
            Start session
          </button>
        </div>
      </section>
    );
  }

  if (deck.length === 0) {
    return (
      <section className="panel setup">
        <p>No questions match these filters.</p>
        <div className="actions" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="btn"
            onClick={() => setStarted(false)}
          >
            Back to filters
          </button>
        </div>
      </section>
    );
  }

  const q = deck[index];
  const done = index >= deck.length;
  if (done || !q) {
    const pct = answered ? Math.round((100 * correctCount) / answered) : 0;
    return (
      <section className="panel results">
        <p className="kicker">Session complete</p>
        <div className="results-score" aria-label={`${pct} percent`}>
          {pct}%
        </div>
        <h1 style={{ fontSize: "1.75rem" }}>
          {correctCount} of {answered} correct
        </h1>
        <p className="lede" style={{ margin: "0 auto" }}>
          {unitTitle}
        </p>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={startSession}>
            Practice again
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setStarted(false)}
          >
            Change filters
          </button>
        </div>
      </section>
    );
  }

  const isCorrect = selected === q.correct;
  const progressPct = Math.round((100 * index) / deck.length);

  function checkAnswer() {
    if (selected == null || revealed) return;
    setRevealed(true);
    setAnswered((n) => n + 1);
    if (selected === q.correct) setCorrectCount((n) => n + 1);
  }

  function next() {
    setSelected(null);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  return (
    <section className="panel quiz">
      <div className="quiz-bar">
        <div className="left">
          Question {index + 1} of {deck.length}
        </div>
        <div className="progress" aria-hidden>
          <i style={{ width: `${progressPct}%` }} />
        </div>
        <div className="right">
          Score {correctCount}/{answered}
        </div>
      </div>

      <div className="quiz-body">
        <div className="quiz-tags">
          <span className="chip">{q.topic}</span>
          <span className="chip">{q.difficulty}</span>
          {section === "trap" && q.trap?.trap_type ? (
            <span className="chip warn">{q.trap.trap_type}</span>
          ) : null}
        </div>

        {q.stimulus && q.stimulus.type !== "none" && q.stimulus.content ? (
          <aside className="stimulus">
            <KatexText text={q.stimulus.content} />
            {q.stimulus.citation ? <cite>{q.stimulus.citation}</cite> : null}
          </aside>
        ) : null}

        <h2 className="stem">
          <KatexText text={q.question} />
        </h2>

        <div className="options" role="radiogroup" aria-label="Answer choices">
          {LETTERS.map((letter) => {
            const text = q.options[letter];
            let state = "";
            if (revealed) {
              if (letter === q.correct) state = "correct";
              else if (letter === selected) state = "wrong";
            } else if (letter === selected) {
              state = "selected";
            }
            return (
              <button
                key={letter}
                type="button"
                role="radio"
                aria-checked={selected === letter}
                className={`option ${state}`}
                disabled={revealed}
                onClick={() => setSelected(letter)}
              >
                <span className="letter">{letter}</span>
                <KatexText text={text} />
              </button>
            );
          })}
        </div>

        {!revealed ? (
          <div className="quiz-footer">
            <button
              type="button"
              className="btn btn-primary"
              disabled={selected == null}
              onClick={checkAnswer}
            >
              Check answer
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStarted(false)}
            >
              Exit
            </button>
          </div>
        ) : (
          <div className={`feedback ${isCorrect ? "ok" : "bad"}`}>
            <p className="feedback-title">
              {isCorrect ? "Correct!" : `Not quite — the answer is ${q.correct}`}
            </p>
            <p>
              <KatexText text={q.explanation} />
            </p>
            {section === "trap" && q.trap ? (
              <div className="trap-box">
                <p>
                  <strong>Why this traps students:</strong>{" "}
                  {q.trap.why_students_fall_for_it}
                </p>
                <p>
                  <strong>How to avoid it:</strong> {q.trap.how_to_avoid}
                </p>
              </div>
            ) : null}
            {q.distractor_notes && selected && selected !== q.correct ? (
              <p className="note">
                Why {selected} is wrong:{" "}
                <KatexText text={q.distractor_notes[selected] || ""} />
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
            <div className="quiz-footer" style={{ borderTop: 0, paddingTop: 0 }}>
              <button type="button" className="btn btn-primary" onClick={next}>
                {index + 1 >= deck.length ? "See results" : "Next question"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
