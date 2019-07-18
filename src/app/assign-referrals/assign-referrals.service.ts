import { Injectable } from '@angular/core';
import { isNil, mergeDeepRight, reject } from 'ramda';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  Assignment,
  EmployeeGroup,
  EmployeeItem,
  EmployeeToMove,
  ReferralAssignmentGrid,
  ReferralFilerType,
} from '../../models/assign-referrals';
import TestEmployees from '../../test/test-data/employees-to-assign.json';
import TestReferrals from '../../test/test-data/unassigned-referrals.json';

interface AssignmentIdAndName {
  referralId: ReferralAssignmentGrid['referralId'];
  assignedTo: ReferralAssignmentGrid['assignedTo'];
}

@Injectable({
  providedIn: 'root',
})
export class AssignReferralsService {
  private pendingAssignments: Assignment[] = [];

  private employeesSubject = new Subject<ReadonlyArray<EmployeeGroup>>();
  private employeesSource: ReadonlyArray<EmployeeGroup>;

  private unassignedReferralsSubject = new Subject<Array<ReferralAssignmentGrid>>();
  private unassignedReferrals: Array<ReferralAssignmentGrid> = [];

  private referralFilerTypeSubject = new BehaviorSubject<ReferralFilerType>('IR');
  referralFilerType$ = this.referralFilerTypeSubject.asObservable();

  private showRecentAssignmentsSubject = new Subject<boolean>();
  showRecentAssignments$ = this.showRecentAssignmentsSubject.asObservable();

  constructor() {}

  getEmployees(): Observable<ReadonlyArray<EmployeeGroup>> {
    return this.getTestEmployees();
  }

  private getTestEmployees(): Observable<ReadonlyArray<EmployeeGroup>> {
    setTimeout(() => {
      this.employeesSource = TestEmployees;
      this.employeesSubject.next(this.employeesSource);
    }, 1);
    return this.employeesSubject.asObservable();
  }

  refreshEmployees() {
    this.employeesSubject.next(this.employeesSource);
  }

  getUnassignedReferrals() {
    // this.spinnerService.show();
    // this.http
    //   .get<Array<ReferralAssignmentGrid>>(apiUrls.assignmentGrid)
    //   .pipe(
    //     catchError(() => {
    //       this.toasterService.error('Failed to retrieve Unassigned Referrals');
    //       return of(null);
    //     }),
    //     finalize(() => this.spinnerService.hide())
    //   )
    //   .subscribe(grid => {
    //     this.unassignedReferrals = grid;
    //     this.unassignedReferralsSubject.next(this.unassignedReferrals);
    //   });
  }

  getReferrals(): Observable<ReadonlyArray<ReferralAssignmentGrid>> {
    // I'm using local test data for this demo.  However, I'm leaving a reference
    // to a function that handles data retrieval.
    this.getUnassignedReferrals();

    const x = TestReferrals.map(r => ({
      ...r,
      intakeDate: new Date(r.intakeDate),
    }));

    setTimeout(() => {
      this.unassignedReferrals = x;
      this.unassignedReferralsSubject.next(this.unassignedReferrals);
    }, 1);
    return this.unassignedReferralsSubject.asObservable();
  }

  referralTypeFilterChanged(type: ReferralFilerType) {
    this.referralFilerTypeSubject.next(type);
    this.unassignedReferralsSubject.next(this.unassignedReferrals);
    this.clearPendingAssignments();
  }

  showRecentAssignmentsChanged(showRecent: boolean) {
    this.showRecentAssignmentsSubject.next(showRecent);
  }

  refreshUnassignedReferrals(): void {
    this.unassignedReferralsSubject.next(this.unassignedReferrals);
  }

  private onSaveSuccess = () => {
    // this.toasterService.success('Saved');
    this.pendingAssignments = [];
    this.getEmployees();
    this.getUnassignedReferrals();
  }

  saveAssignments(): Observable<boolean> {
    if (this.pendingAssignments === null) {
      // this.toasterService.info('Nothing to save');
      return;
    }
    console.table(this.pendingAssignments);
    return of(false);
    // this.spinnerService.show();

    // return this.http.post<ReadonlyArray<Assignment>>(apiUrls.assign, this.pendingAssignments).pipe(
    //   tap(() => this.onSaveSuccess()),
    //   map(() => true),
    //   catchError(() => {
    //     this.toasterService.error('Save Failed');
    //     return of(false);
    //   }),
    //   finalize(() => this.spinnerService.hide())
    // );
  }

  droppedFromEmployeeToReferral(e: EmployeeItem, r: ReferralAssignmentGrid) {
    this.removePendingAssignment(r.referralId);
    this.pendingAssignments.push({ referralId: r.referralId, employeeId: e.employeeId });
    this.updateUnassignedReferrals({ referralId: r.referralId, assignedTo: e.socialWorker });
  }

  droppedWithinReferrals(e: EmployeeToMove) {
    this.updatePendingAssignment(e);
    this.updateUnassignedReferrals({ referralId: e.sourceReferralId, assignedTo: '' });
    this.updateUnassignedReferrals({ referralId: e.targetReferralId, assignedTo: e.socialWorker });
  }

  removeEmployeeFromReferral(r: ReferralAssignmentGrid) {
    if (isNil(r)) {
      return;
    }

    this.removePendingAssignment(r.referralId);
    r.assignedTo = null;
  }

  private updatePendingAssignment(e: EmployeeToMove) {
    const source = this.pendingAssignments.find(a => a.referralId === e.sourceReferralId);
    const target = this.pendingAssignments.find(a => a.referralId === e.targetReferralId);

    isNil(target)
      ? this.pendingAssignments.push({
          referralId: e.targetReferralId,
          employeeId: source.employeeId,
        })
      : (target.employeeId = source.employeeId);

    this.removePendingAssignment(source.referralId);
  }

  private removePendingAssignment(refId: Assignment['referralId']) {
    this.pendingAssignments = reject(a => a.referralId === refId, this.pendingAssignments);
  }

  private updateUnassignedReferrals(a: AssignmentIdAndName) {
    this.unassignedReferrals = this.unassignedReferrals.map(r =>
      r.referralId === a.referralId ? (r = mergeDeepRight(r, a)) : r
    );
    this.unassignedReferralsSubject.next(this.unassignedReferrals);
  }

  private clearPendingAssignments() {
    this.pendingAssignments = [];
  }
}
/*
import { of, pipe, Subject, BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as R from 'ramda';

const a = [1,2,3,4,5,6,7,8,9,10]
const sourceBS = new BehaviorSubject<number[]>([]);
const sourceS = new Subject<number[]>();
const source$= sourceS.asObservable();
// let source$ = of([1,2,3,4,5,6,7,8]);

const gt3 = x => x > 3
const lt8 = x => x < 8;
const isEven = x => x % 2 == 0;

let pred = R.allPass([gt3, isEven, lt8]);

const j = pipe(
  map((arr: number[]) => arr.filter(pred))
);

const filtered$ = j(source$)
filtered$.subscribe(x => console.log(x));


const btn = document.getElementById('jb');
btn.addEventListener('click', jb)

function jb() {
  console.log('clicked')
  pred = R.allPass([gt3]);
  sourceS.next(a)
}

sourceS.next(a)
*/
