import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlueprint } from "@/lib/data";
import { SUBJECT_IDS, SUBJECTS, isSubjectId } from "@/lib/subjects";

export async function generateStaticParams() {
  const params: { subject: string; unit: string }[] = [];
  for (const subject of SUBJECT_IDS) {
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
  const subject = SUBJECTS[params.subject];
  const unitNum = Number(params.unit);
  if (
    !Number.isInteger(unitNum) ||
    unitNum < 1 ||
    unitNum > subject.maxParts
  ) {
    notFound();
  }

  const blueprint = await getBlueprint(params.subject);
  const unit = blueprint.units.find((u) => u.unit === unitNum);
  if (!unit) notFound();

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Courses</Link>
        <span className="sep">/</span>
        <Link href={`/${params.subject}`}>{subject.short}</Link>
        <span className="sep">/</span>
        <span>
          {subject.partLabel} {unit.unit}
        </span>
      </nav>

      <p className="kicker">
        {subject.partLabel} {unit.unit}
      </p>
      <h1>{unit.title}</h1>
      <p className="lede">
        Start with standard practice to build coverage, then use trap mode to
        train against the most common wrong answers.
      </p>

      <div className="mode-grid">
        <Link
          href={`/${params.subject}/${unit.unit}/standard`}
          className="mode-card standard"
        >
          <div className="icon-circle">P</div>
          <h2>Practice</h2>
          <p>
            Full {subject.partLabel.toLowerCase()} bank with explanations after
            every answer. Filter by topic and difficulty.
          </p>
          <span className="chip accent">
            {unit.standard_count || 0} questions
          </span>
          <span className="cta">Start practice →</span>
        </Link>
        <Link
          href={`/${params.subject}/${unit.unit}/traps`}
          className="mode-card traps"
        >
          <div className="icon-circle">T</div>
          <h2>Trap drills</h2>
          <p>
            Focused items for misconceptions, absolute wording, near-miss facts,
            and other exam traps.
          </p>
          <span className="chip warn">{unit.trap_count || 0} traps</span>
          <span className="cta">Start trap drills →</span>
        </Link>
      </div>
    </>
  );
}
