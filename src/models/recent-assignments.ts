export interface RecentAssignments {
  referralId: number;
  intakeDate: Date;
  referralTypeID: string;
  cwsRefNumber: string;
  cwsRefName: string;
  unKnownMother: boolean;
  incidentZipCode: string;
  regionDescription: string;
  specialSkill: string;
  specialRequest: string;
  assignedTo: string;
  assignmentDate: Date;
}

export interface RecentAssignmentsColumn {
  field: keyof RecentAssignments;
  header: string;
}
