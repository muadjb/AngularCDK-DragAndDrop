import { environment } from '@env/environment';

const base = environment.apiUrl;
export const listBaseUrl = `${base}/List`;

export const apiUrls = {
  // Admin
  availabilityType: `${base}/Admin/AvailabilityType`,
  specialtyCode: `${base}/Admin/SpecialtyCode`,
  schedule: `${base}/Admin/Schedule`,
  abuseType: `${base}/Admin/AbuseType`,
  cwsAbuseCategory: `${base}/Admin/AbuseCategory`,
  cwsAbuseSubCategory: `${base}/Admin/AbuseSubcategory`,
  cwsClosureReasonCategory: `${base}/Admin/ClosureReason`,
  cwsClosureReasonSubCategory: `${base}/Admin/ClosureReasonSubcategory`,
  cwsDeterminedResponseCategory: `${base}/Admin/DeterminedResponse`,
  cwsDeterminedResponseSubCategory: `${base}/Admin/DeterminedResponseSubcategory`,

  // Auth
  permission: `${base}/Auth/Permission`,
  currentUser: `${base}/Auth/CurrentUser`,
  privacyRole: `${base}/Auth/PrivacyRole`,
  securityRole: `${base}/Auth/SecurityRole`,
  users: `${base}/Auth/AMSUsers`,

  // Availability
  employeeStatus: `${base}/EmployeeStatus`,
  timeOff: `${base}/TimeOff`,
  timeOffRequests: `${base}/TimeOff/Requests`,
  approveTimeOff: `${base}/TimeOff/Approved`,
  denyTimeOff: `${base}/TimeOff/Denied`,
  requestTimeOff: `${base}/TimeOff/Request`,
  resubmitTimeOff: `${base}/TimeOff/Resubmit`,
  calendar: `${base}/Calendar`,
  calendarDetails: `${base}/Calendar/Details`,

  // Employee
  kpi: `${base}/Employee/KPI`,
  employeesToAssign: `${base}/Employee/ToAssignReferrals`,
  myEmployees: `${base}/Employee/MyEmployees`,
  notificationOptions: `${base}/Employee/NotificationOptions`,

  // List
  calendarFilters: `${base}/List/AvailabilityCalendarFilter`,

  // Referrals
  referrals: `${base}/Referrals`,
  assign: `${base}/Referrals/AssignReferrals`,
  assignmentGrid: `${base}/Referrals/AssignmentGrid`,
  locked: `${base}/Referrals/Locked`,
  myReferrals: `${base}/Referrals/MyReferrals`,
  recentAssignments: `${base}/Referrals/RecentAssignments`,
  task: `${base}/Referrals/Task`,
  tasks: `${base}/Referrals/Tasks`,
  outcomeTask: `${base}/Referrals/OutcomeTask`,
  unitSummary: `${base}/Referrals/UnitSummary`,
};
