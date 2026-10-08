import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlueprint } from "@/lib/data";
import { SUBJECTS, isSubjectId } from "@/lib/subjects";

export function generateStaticParams() {
  return [{ subject: "apush" }, { subject: "apchem" }];
}

export default async function SubjectPage({
  params,
}: {
  params: { subject: string };
}) {
  if (!isSubjectId(params.subject)) notFound();
  const subject = SUBJECTS[params.subject];
  const blueprint = await getBlueprint(params.subject);
  const total =
    blueprint.units.reduce((n, u) => n + (u.standard_count || 0), 0) +
    blueprint.units.reduce((n, u) => n + (u.trap_count || 0), 0);

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Courses</Link>
        <span className="sep">/</span>
        <span>{subject.short}</span>
      </nav>

      <div className="subject-header">
        <div className="subject-banner">
          <div
            className="course-icon"
            style={{ background: subject.accent }}
            aria-hidden
          >
            {subject.short === "APUSH" ? "USH" : "CHM"}
          </div>
          <div>
            <p className="kicker">Course</p>
            <h1 style={{ marginBottom: "0.35rem" }}>{subject.name}</h1>
            <p className="lede" style={{ maxWidth: "36rem" }}>
              {subject.blurb} {total.toLocaleString()} questions across{" "}
              {blueprint.units.length} units.
            </p>
          </div>
        </div>
      </div>

      <p className="section-label">Unit list</p>
      <div className="unit-list">
        {blueprint.units.map((unit) => {
          const count =
            (unit.standard_count || 0) + (unit.trap_count || 0);
          return (
            <Link
              key={unit.unit}
              href={`/${params.subject}/${unit.unit}`}
              className="unit-row"
            >
              <div className="unit-num">{unit.unit}</div>
              <div>
                <h2>{unit.title}</h2>
                <p className="sub">
                  {(unit.topics || []).length} topics · {count} questions
                </p>
              </div>
              <div className="unit-actions">
                <span className="chip accent">
                  {unit.standard_count || 0} practice
                </span>
                <span className="chip warn">{unit.trap_count || 0} traps</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
