import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlueprint } from "@/lib/data";
import { SUBJECTS, isSubjectId } from "@/lib/subjects";

export async function generateStaticParams() {
  const subjects = ["apush", "apchem"] as const;
  const params: { subject: string; unit: string }[] = [];
  for (const subject of subjects) {
    const bp = await getBlueprint(subject);
    for (const unit of bp.units) {
      params.push({ subject, unit: String(unit.unit) });
    }
  }
  return params;
}

export default async function UnitPage({
  params,
}: {
  params: { subject: string; unit: string };
}) {
  if (!isSubjectId(params.subject)) notFound();
  const unitNum = Number(params.unit);
  if (!Number.isInteger(unitNum) || unitNum < 1 || unitNum > 9) notFound();

  const subject = SUBJECTS[params.subject];
  const blueprint = await getBlueprint(params.subject);
  const unit = blueprint.units.find((u) => u.unit === unitNum);
  if (!unit) notFound();

  return (
    <>
      <p className="eyebrow">
        <Link href={`/${params.subject}`}>{subject.short}</Link> · Unit {unit.unit}
      </p>
      <h1>{unit.title}</h1>
      <p className="lede">
        Choose a mode. Trap mode shows why the tempting wrong answer looks right,
        and how to avoid it.
      </p>
      <div className="mode-grid">
        <Link
          href={`/${params.subject}/${unit.unit}/standard`}
          className="card"
        >
          <p className="eyebrow">Mode</p>
          <h2>Standard practice</h2>
          <p>Full unit bank with explanations after each answer.</p>
          <div className="meta">
            <span className="pill">{unit.standard_count || 0} questions</span>
          </div>
        </Link>
        <Link href={`/${params.subject}/${unit.unit}/traps`} className="card">
          <p className="eyebrow">Mode</p>
          <h2>Trap questions</h2>
          <p>Common pitfalls, absolute wording, near-miss facts, and more.</p>
          <div className="meta">
            <span className="pill trap">{unit.trap_count || 0} traps</span>
          </div>
        </Link>
      </div>
    </>
  );
}
