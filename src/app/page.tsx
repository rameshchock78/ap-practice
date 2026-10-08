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

  return (
    <>
      <p className="eyebrow">High school AP practice</p>
      <h1>Drill every unit. Then drill the traps.</h1>
      <p className="lede">
        A local question bank for AP U.S. History and AP Chemistry — standard MCQs
        plus a separate trap set for each unit, with explanations after every
        answer.
      </p>
      <div className="grid two">
        {cards.map((c) => (
          <Link key={c.id} href={`/${c.id}`} className="card">
            <p className="eyebrow">{c.short}</p>
            <h2>{c.name}</h2>
            <p>{c.blurb}</p>
            <div className="meta">
              <span className="pill">{c.units} units</span>
              <span className="pill">{c.standard.toLocaleString()} standard</span>
              <span className="pill trap">{c.traps.toLocaleString()} traps</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
