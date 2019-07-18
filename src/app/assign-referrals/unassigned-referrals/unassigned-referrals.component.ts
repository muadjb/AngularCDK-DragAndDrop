import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { without } from 'ramda';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  EmployeeItem,
  HideColumnIsChecked,
  ReferralAssignmentGrid,
  ReferralFilerType,
  UnassignedReferralColumn,
} from '../../../models/assign-referrals';
import { AssignReferralsService } from '../assign-referrals.service';

@Component({
  selector: 'ams-unassigned-referrals',
  templateUrl: './unassigned-referrals.component.html',
  styleUrls: ['./unassigned-referrals.component.scss'],
})
export class UnassignedReferralsComponent implements OnInit {
  private referralType: ReferralFilerType = 'IR';
  private unassignedReferrals$: Observable<ReadonlyArray<ReferralAssignmentGrid>>;
  filteredReferrals$: Observable<ReadonlyArray<ReferralAssignmentGrid>>;

  columnsMaster: UnassignedReferralColumn[] = [
    { field: 'intakeDate', header: 'Intake' },
    { field: 'referralTypeID', header: 'Type' },
    { field: 'cwsRefName', header: 'Ref Name' },
    { field: 'cwsRefNumber', header: 'Ref #' },
    { field: 'incidentZipCode', header: 'Zip' },
    { field: 'regionDescription', header: 'Region' },
    { field: 'specialSkill', header: 'Language' },
    { field: 'specialRequest', header: 'Request' },
    { field: 'assignedTo', header: 'Assigned To' },
  ];

  displayedColumns = this.columnsMaster;
  selectedColumnNames: Array<UnassignedReferralColumn['field']>;
  showRecentClicked = false;

  constructor(private assignReferralsService: AssignReferralsService) {
    this.selectedColumnNames = this.getAllColumnFields();
  }

  ngOnInit() {
    this.unassignedReferrals$ = this.assignReferralsService.getReferrals();

    this.filteredReferrals$ = this.unassignedReferrals$.pipe(
      tap(x => console.log(x)),
      map(rs => rs.filter(r => r.referralTypeID.startsWith(this.referralType)))
    );
  }

  onIR() {
    this.referralType = 'IR';
    this.assignReferralsService.referralTypeFilterChanged('IR');
  }

  on10Day() {
    this.referralType = '10D';
    this.assignReferralsService.referralTypeFilterChanged('10D');
  }

  onHideColumnInit(checkedNames: Array<UnassignedReferralColumn['field']>) {
    this.selectedColumnNames = checkedNames;
    this.updateDisplayedColumns();
  }

  onHideColumnChange({ name, isChecked }: HideColumnIsChecked<UnassignedReferralColumn['field']>) {
    if (isChecked) {
      this.selectedColumnNames.push(name);
    } else {
      this.selectedColumnNames = without([name], this.selectedColumnNames);
    }

    this.updateDisplayedColumns();
  }

  private updateDisplayedColumns() {
    const inSelectedColumns = (c: UnassignedReferralColumn) =>
      this.selectedColumnNames.includes(c.field);
    this.displayedColumns = this.columnsMaster.filter(inSelectedColumns);
  }

  onShowRecent(isChecked: boolean) {
    this.assignReferralsService.showRecentAssignmentsChanged(isChecked);

    if (!isChecked) {
      this.assignReferralsService.getUnassignedReferrals();
    }
  }

  onDropOnRemoveZone(r: ReferralAssignmentGrid | undefined) {
    this.assignReferralsService.removeEmployeeFromReferral(r);
  }

  onDropOnTable(e: CdkDragDrop<any>) {
    this.isSameTable(e.container, e.previousContainer)
      ? this.droppedWithinTable(e)
      : this.droppedFromEmployeeTable(e);
  }

  private droppedFromEmployeeTable(d: CdkDragDrop<any>) {
    const e: EmployeeItem = d.item.data;
    const r: ReferralAssignmentGrid = d.container.data;

    this.assignReferralsService.droppedFromEmployeeToReferral(e, r);
  }

  private droppedWithinTable(d: CdkDragDrop<any>) {
    const targetRefId = d.container.data.referralId;
    const sourceReferral: ReferralAssignmentGrid = d.previousContainer.data;

    this.assignReferralsService.droppedWithinReferrals({
      sourceReferralId: sourceReferral.referralId,
      targetReferralId: targetRefId,
      socialWorker: sourceReferral.assignedTo,
    });
  }

  private isSameTable(c1: CdkDropList, c2: CdkDropList): boolean {
    return c1.element.nativeElement.parentElement === c2.element.nativeElement.parentElement;
  }

  private getAllColumnFields(): Array<UnassignedReferralColumn['field']> {
    return this.columnsMaster.map(c => c.field);
  }
}
