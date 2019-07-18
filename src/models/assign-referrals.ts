export enum RowState {
  Clear = 0,
  Insert = 1,
  Update = 2,
}

export interface EmployeeGroup {
  specialtyCode: string;
  employees: EmployeeItem[];
}

export interface EmployeeItem {
  employeeId: number;
  socialWorker: string;
  workerCode: string;
  region: string;
  specialSkill: string;
  specialtyCode: string;
  availability: string;
  comment: string;
  workloadCapacity: number;
  irPercent: number;
  referralPerFTE: number;
  irCount: number;
  tenDayCount: number;
  referralCount: number;
  totalDaysAvailable: number;
  offIRs: boolean;
  off10Days: boolean;
  lessThanAvgRPF: boolean;
  todaysIRs: number;
  hadIRYesterday: boolean;
  isHere3of5Days: boolean;
}

export interface ReferralAssignmentGrid {
  rowState: RowState;
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
}

export interface Assignment {
  referralId: ReferralAssignmentGrid['referralId'];
  employeeId: EmployeeItem['employeeId'];
}

export interface EmployeeToAdd {
  referralId: ReferralAssignmentGrid['referralId'];
  employeeId: EmployeeItem['employeeId'];
  socialWorker: EmployeeItem['socialWorker'];
}

export interface EmployeeToMove {
  sourceReferralId: ReferralAssignmentGrid['referralId'];
  targetReferralId: ReferralAssignmentGrid['referralId'];
  socialWorker: EmployeeItem['socialWorker'];
}

export type ReferralFilerType = 'IR' | '10D';

export interface UnassignedReferralColumn {
  field: keyof ReferralAssignmentGrid;
  header: string;
}

export interface EmployeeColumn {
  field: keyof EmployeeItem;
  header: string;
}

export interface HideColumnIsChecked<T> {
  name: T;
  isChecked: boolean;
}
