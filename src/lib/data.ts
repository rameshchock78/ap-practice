import { promises as fs } from "fs";
import path from "path";
import { SUBJECTS } from "./subjects";
import type { Blueprint, Question, Section, SubjectId } from "./types";

const dataRoot = path.join(process.cwd(), "data");

export async function getBlueprint(subject: SubjectId): Promise<Blueprint> {
  const raw = await fs.readFile(
    path.join(dataRoot, subject, "blueprint.json"),
    "utf8",
  );
  const blueprint = JSON.parse(raw) as Blueprint;

  const units = await Promise.all(
    blueprint.units.map(async (unit) => {
      const [standard, traps] = await Promise.all([
        loadUnitQuestions(subject, unit.unit, "standard"),
        loadUnitQuestions(subject, unit.unit, "trap"),
      ]);
      return {
        ...unit,
        standard_count: standard.length,
        trap_count: traps.length,
      };
    }),
  );

  return { ...blueprint, units };
}

export async function loadUnitQuestions(
  subject: SubjectId,
  unit: number,
  section: Section,
): Promise<Question[]> {
  const folder = section === "standard" ? "questions" : "traps";
  const prefix = SUBJECTS[subject].filePrefix;
  const file = path.join(
    dataRoot,
    subject,
    folder,
    `${prefix}-${String(unit).padStart(2, "0")}.json`,
  );
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as Question[];
}

export function shuffle<T>(items: T[], seed?: number): T[] {
  const arr = [...items];
  let s = seed ?? Date.now() % 2147483647;
  const rand = () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
