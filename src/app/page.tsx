import Link from "next/link";
import { getBlueprint } from "@/lib/data";
import { SUBJECT_IDS, SUBJECTS } from "@/lib/subjects";

export default async function HomePage() {
  const blueprints = await Promise.all(
    SUBJECT_IDS.map(async (id) => ({ id, bp: await getBlueprint(id) })),
  );

  const cards = blueprints.map(({ id, bp }) => {
    const meta = SUBJECTS[id];
    const standard = bp.units.reduce((n, u) => n + (u.standard_count || 0), 0);
    const traps = bp.units.reduce((n, u) => n + (u.trap_count || 0), 0);
    return {
      ...meta,
      standard,
      traps,
      parts: bp.units.length,
    };
  });

  const totalQ = cards.reduce((n, c) => n + c.standard + c.traps, 0);

  return (
    <>
      <section className="hero">
        <div>
          <p className="kicker">Free exam practice</p>
          <h1>AP and SAT practice, one question at a time</h1>
          <p className="lede">
            Structured practice across AP U.S. History, AP Chemistry, and Digital
            SAT Reading & Writing — with a separate trap mode for the mistakes
            students make most often.
          </p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>{totalQ.toLocaleString()}</strong>
            <span>Practice questions</span>
          </div>
          <div className="hero-stat">
            <strong>{cards.length}</strong>
            <span>Courses</span>
          </div>
          <div className="hero-stat">
            <strong>
              {cards.reduce((n, c) => n + c.parts, 0)}
            </strong>
            <span>Units & domains</span>
          </div>
        </div>
      </section>

      <p className="section-label">Courses</p>
      <div className="course-grid three">
        {cards.map((c) => (
          <Link key={c.id} href={`/${c.id}`} className="course-card">
            <div
              className="course-icon"
              style={{ background: c.accent }}
              aria-hidden
            >
              {c.icon}
            </div>
            <div>
              <h2>{c.name}</h2>
              <p>{c.blurb}</p>
              <div className="course-meta">
                <span className="chip">
                  {c.parts} {c.partLabelPlural}
                </span>
                <span className="chip accent">
                  {c.standard.toLocaleString()} practice
                </span>
                <span className="chip warn">{c.traps.toLocaleString()} traps</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
