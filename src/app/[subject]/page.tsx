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

  return (
    <>
      <p className="eyebrow">{subject.short}</p>
      <h1>{subject.name}</h1>
      <p className="lede">{subject.blurb} Pick a unit to practice.</p>
      <div className="grid">
        {blueprint.units.map((unit) => (
          <Link
            key={unit.unit}
            href={`/${params.subject}/${unit.unit}`}
            className="card"
          >
            <div className="unit-row">
              <div>
                <p className="eyebrow">Unit {unit.unit}</p>
                <h2>{unit.title}</h2>
                <p>
                  {(unit.topics || []).length} topics ·{" "}
                  {(unit.standard_count || 0) + (unit.trap_count || 0)} questions
                </p>
              </div>
              <div className="counts">
                <span className="pill">{unit.standard_count || 0} standard</span>
                <span className="pill trap">{unit.trap_count || 0} traps</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
