import type { SubjectId } from "./types";

export const SUBJECTS: Record<
  SubjectId,
  { id: SubjectId; name: string; short: string; blurb: string }
> = {
  apush: {
    id: "apush",
    name: "AP U.S. History",
    short: "APUSH",
    blurb: "Periods 1–9 with stimulus-based practice and trap drills.",
  },
  apchem: {
    id: "apchem",
    name: "AP Chemistry",
    short: "AP Chem",
    blurb: "Units 1–9 with calculation practice and trap drills.",
  },
};

export function isSubjectId(value: string): value is SubjectId {
  return value === "apush" || value === "apchem";
}
