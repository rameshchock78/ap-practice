import type { SubjectId } from "./types";

export type SubjectMeta = {
  id: SubjectId;
  name: string;
  short: string;
  blurb: string;
  accent: string;
  accentSoft: string;
  icon: string;
  /** Label for the numbered sections (Unit vs Domain) */
  partLabel: string;
  partLabelPlural: string;
  maxParts: number;
  filePrefix: "unit" | "domain";
};

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  apush: {
    id: "apush",
    name: "AP U.S. History",
    short: "APUSH",
    blurb:
      "Master all nine periods with stimulus-based questions and trap drills that mirror exam habits.",
    accent: "#1865f2",
    accentSoft: "#e8f0fe",
    icon: "USH",
    partLabel: "Unit",
    partLabelPlural: "units",
    maxParts: 9,
    filePrefix: "unit",
  },
  apchem: {
    id: "apchem",
    name: "AP Chemistry",
    short: "AP Chem",
    blurb:
      "Build fluency across all nine units with calculation practice, data tables, and common misconceptions.",
    accent: "#0c8066",
    accentSoft: "#e6f5f1",
    icon: "CHM",
    partLabel: "Unit",
    partLabelPlural: "units",
    maxParts: 9,
    filePrefix: "unit",
  },
  satrw: {
    id: "satrw",
    name: "SAT Reading & Writing",
    short: "SAT English",
    blurb:
      "Digital SAT Reading and Writing across all four domains — evidence, craft, expression, and conventions — plus trap drills.",
    accent: "#0369a1",
    accentSoft: "#e0f2fe",
    icon: "SAT",
    partLabel: "Domain",
    partLabelPlural: "domains",
    maxParts: 4,
    filePrefix: "domain",
  },
};

export const SUBJECT_IDS = Object.keys(SUBJECTS) as SubjectId[];

export function isSubjectId(value: string): value is SubjectId {
  return value in SUBJECTS;
}
