export interface Judge {
  id: string;
  name: string;
  fullName: string;
  position: string;
  type: string;
  status: string;
  dateOfBirth: string;
  appointmentDate: string;
  retirementDate: string;
  termOfOffice?: {
    start: string;
    end: string;
  };
  image: string;
  education?: string[];
  careerHighlights?: string[];
  biography: string;
  notableJudgments?: string[];
  specializations: string[];
}

export interface JudgesData {
  currentChiefJustice: Judge;
  currentJudges: Judge[];
  formerChiefJustices: Judge[];
  formerJudges: Judge[];
}