export type SubjectId = "apush" | "apchem";
export type Section = "standard" | "trap";
export type Difficulty = "easy" | "medium" | "hard";

export type Stimulus = {
  type: "text" | "image" | "table" | "graph" | "none";
  content?: string;
  citation?: string;
  asset_path?: string | null;
} | null;

export type TrapMeta = {
  trap_type: string;
  trap_description: string;
  tempting_wrong_option: "A" | "B" | "C" | "D";
  why_students_fall_for_it: string;
  how_to_avoid: string;
} | null;

export type Question = {
  id: string;
  subject: SubjectId;
  unit: number;
  unit_title: string;
  topic: string;
  topic_title: string;
  learning_objective?: string;
  skill?: string;
  difficulty: Difficulty;
  stimulus?: Stimulus;
  question: string;
  options: Record<"A" | "B" | "C" | "D", string>;
  correct: "A" | "B" | "C" | "D";
  explanation: string;
  distractor_notes?: Partial<Record<"A" | "B" | "C" | "D", string>>;
  tags?: string[];
  section: Section;
  trap?: TrapMeta;
  origin?: string;
  source?: {
    name?: string;
    url?: string;
    license?: string;
    attribution?: string;
  } | null;
  verification?: {
    status: string;
    method?: string;
    confidence?: number;
    citations?: string[];
  };
};

export type BlueprintUnit = {
  unit: number;
  title: string;
  topics: { id: string; title: string; learning_objective?: string }[];
  standard_count?: number;
  trap_count?: number;
};

export type Blueprint = {
  subject: SubjectId;
  name: string;
  units: BlueprintUnit[];
};
