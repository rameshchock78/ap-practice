import Link from "next/link";
import { notFound } from "next/navigation";
import { Quiz } from "@/components/Quiz";
import { getBlueprint, loadUnitQuestions } from "@/lib/data";
import { SUBJECT_IDS, SUBJECTS, isSubjectId } from "@/lib/subjects";
import type { Section } from "@/lib/types";

export async function generateStaticParams() {
  const modes = ["standard", "traps"] as const;
  const params: { subject: string; unit: string; mode: string }[] = [];
  for (const subject of SUBJECT_IDS) {
    const bp = await getBlueprint(subject);
    for (const unit of bp.units) {
      for (const mode of modes) {
        params.push({ subject, unit: String(unit.unit), mode });
      }
    }
  }
  return params;
}

export default async function PracticePage({
  params,
}: {
  params: { subject: string; unit: string; mode: string };
}) {
  if (!isSubjectId(params.subject)) notFound();
  if (params.mode !== "standard" && params.mode !== "traps") notFound();

  const subject = SUBJECTS[params.subject];
  const unitNum = Number(params.unit);
  if (
    !Number.isInteger(unitNum) ||
    unitNum < 1 ||
    unitNum > subject.maxParts
  ) {
    notFound();
  }

  const section: Section = params.mode === "traps" ? "trap" : "standard";
  const blueprint = await getBlueprint(params.subject);
  const unit = blueprint.units.find((u) => u.unit === unitNum);
  if (!unit) notFound();

  const questions = await loadUnitQuestions(params.subject, unitNum, section);
  const modeLabel = section === "trap" ? "Trap drills" : "Practice";

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Courses</Link>
        <span className="sep">/</span>
        <Link href={`/${params.subject}`}>{subject.short}</Link>
        <span className="sep">/</span>
        <Link href={`/${params.subject}/${unit.unit}`}>
          {subject.partLabel} {unit.unit}
        </Link>
        <span className="sep">/</span>
        <span>{modeLabel}</span>
      </nav>
      <Quiz
        questions={questions}
        section={section}
        subjectLabel={subject.name}
        unitTitle={unit.title}
      />
    </>
  );
}
