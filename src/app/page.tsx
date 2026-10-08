import Link from "next/link";
import { getBlueprint } from "@/lib/data";
import { SUBJECTS } from "@/lib/subjects";

export default async function HomePage() {
  const [apush, apchem] = await Promise.all([
    getBlueprint("apush"),
    getBlueprint("apchem"),
  ]);

  const cards = [
    {
      ...SUBJECTS.apush,
      standard: apush.units.reduce((n, u) => n + (u.standard_count || 0), 0),
      traps: apush.units.reduce((n, u) => n + (u.trap_count || 0), 0),
      units: apush.units.length,
    },
    {
      ...SUBJECTS.apchem,
      standard: apchem.units.reduce((n, u) => n + (u.standard_count || 0), 0),
      traps: apchem.units.reduce((n, u) => n + (u.trap_count || 0), 0),
      units: apchem.units.length,
    },
  ];

  const totalQ =
    cards[0].standard + cards[0].traps + cards[1].standard + cards[1].traps;

  return (
    <>
      <section className="hero">
        <div>
          <p className="kicker">Free AP practice</p>
          <h1>Learn AP U.S. History and Chemistry, one question at a time</h1>
          <p className="lede">
            Structured practice across every unit — with a separate trap mode for
            the mistakes students make most often. Instant explanations after each
            answer.
          </p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>{totalQ.toLocaleString()}</strong>
            <span>Practice questions</span>
          </div>
          <div className="hero-stat">
            <strong>2</strong>
            <span>AP subjects</span>
          </div>
          <div className="hero-stat">
            <strong>18</strong>
            <span>Units covered</span>
          </div>
        </div>
      </section>

      <p className="section-label">Courses</p>
      <div className="course-grid">
        {cards.map((c) => (
          <Link key={c.id} href={`/${c.id}`} className="course-card">
            <div
              className="course-icon"
              style={{ background: c.accent }}
              aria-hidden
            >
              {c.short === "APUSH" ? "USH" : "CHM"}
            </div>
            <div>
              <h2>{c.name}</h2>
              <p>{c.blurb}</p>
              <div className="course-meta">
                <span className="chip">{c.units} units</span>
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
