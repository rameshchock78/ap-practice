import type { SubjectId } from "./types";

export const SUBJECTS: Record<
  SubjectId,
  {
    id: SubjectId;
    name: string;
    short: string;
    blurb: string;
    accent: string;
    accentSoft: string;
  }
> = {
  apush: {
    id: "apush",
    name: "AP U.S. History",
    short: "APUSH",
    blurb:
      "Master all nine periods with stimulus-based questions and trap drills that mirror exam habits.",
    accent: "#1865f2",
    accentSoft: "#e8f0fe",
  },
  apchem: {
    id: "apchem",
    name: "AP Chemistry",
    short: "AP Chem",
    blurb:
      "Build fluency across all nine units with calculation practice, data tables, and common misconceptions.",
    accent: "#0c8066",
    accentSoft: "#e6f5f1",
  },
};

export function isSubjectId(value: string): value is SubjectId {
  return value === "apush" || value === "apchem";
}
