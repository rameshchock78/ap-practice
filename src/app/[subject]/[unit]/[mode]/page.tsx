import Link from "next/link";
import { notFound } from "next/navigation";
import { Quiz } from "@/components/Quiz";
import { getBlueprint, loadUnitQuestions } from "@/lib/data";
import { SUBJECTS, isSubjectId } from "@/lib/subjects";
import type { Section } from "@/lib/types";

export async function generateStaticParams() {
  const subjects = ["apush", "apchem"] as const;
  const modes = ["standard", "traps"] as const;
  const params: { subject: string; unit: string; mode: string }[] = [];
  for (const subject of subjects) {
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

  const unitNum = Number(params.unit);
  if (!Number.isInteger(unitNum) || unitNum < 1 || unitNum > 9) notFound();

  const section: Section = params.mode === "traps" ? "trap" : "standard";
  const subject = SUBJECTS[params.subject];
  const blueprint = await getBlueprint(params.subject);
  const unit = blueprint.units.find((u) => u.unit === unitNum);
  if (!unit) notFound();

  const questions = await loadUnitQuestions(params.subject, unitNum, section);

  return (
    <>
      <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
        <Link href={`/${params.subject}`}>{subject.short}</Link>
        {" · "}
        <Link href={`/${params.subject}/${unit.unit}`}>Unit {unit.unit}</Link>
        {" · "}
        {section === "trap" ? "Traps" : "Standard"}
      </p>
      <Quiz
        questions={questions}
        section={section}
        subjectLabel={subject.name}
        unitTitle={unit.title}
      />
    </>
  );
}
