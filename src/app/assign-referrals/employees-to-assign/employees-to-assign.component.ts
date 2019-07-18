import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import {
  EmployeeColumn,
  EmployeeGroup,
  EmployeeItem,
  HideColumnIsChecked,
  ReferralFilerType,
} from '../../../models/assign-referrals';
import { allPass, ascend, prop, sortWith, without } from 'ramda';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AssignReferralsService } from '../assign-referrals.service';
import {
  addPredicates,
  ALL_GROUPS,
  getDefaultPredicates,
  PredicateName,
  Predicates,
  removePredicates,
  updateGroupPredicate,
  updateSearchPredicate,
} from './predicates';

type Compare = (e1: EmployeeItem, e2: EmployeeItem) => number;
type GroupCodes = Array<EmployeeGroup['specialtyCode']>;

const columnsMaster: EmployeeColumn[] = [
  { field: 'socialWorker', header: 'Employee' },
  { field: 'workerCode', header: 'Code' },
  { field: 'region', header: 'Region' },
  { field: 'specialSkill', header: 'Language' },
  { field: 'specialtyCode', header: 'Specialty' },
  { field: 'availability', header: 'Avail' },
  { field: 'comment', header: 'Comment' },
  { field: 'workloadCapacity', header: 'Capacity' },
  { field: 'referralPerFTE', header: 'Refs / FTE' },
  { field: 'hadIRYesterday', header: 'IR YDA' },
  { field: 'irPercent', header: 'IR %' },
  { field: 'todaysIRs', header: 'IR Today' },
  { field: 'irCount', header: 'IR' },
  { field: 'tenDayCount', header: '10 Day' },
  { field: 'referralCount', header: 'Total' },
  { field: 'totalDaysAvailable', header: 'Days Avail' },
];

@Component({
  selector: 'ams-employees-to-assign',
  templateUrl: './employees-to-assign.component.html',
  styleUrls: ['./employees-to-assign.component.scss'],
})
export class EmployeesToAssignComponent implements OnInit {
  private predicates: Predicates;

  private employeeGroups$: Observable<ReadonlyArray<EmployeeGroup>>;
  filteredGroups$: Observable<ReadonlyArray<EmployeeGroup>>;
  groups$: Observable<ReadonlyArray<EmployeeGroup['specialtyCode']>>;

  columnsForHideDropdown: Array<EmployeeColumn> = [];
  displayedColumns = columnsMaster;
  isDisabled = false;
  is10DayType = false;
  selectedColumnNames: Array<EmployeeColumn['field']>;
  sortE = sortWith<EmployeeItem>([]);

  constructor(private assignReferralsService: AssignReferralsService) {
    this.selectedColumnNames = this.getAllColumnFields();
  }

  ngOnInit() {
    this.assignReferralsService.showRecentAssignments$.subscribe(this.disableForRecentAssignments);
    this.assignReferralsService.referralFilerType$.subscribe(this.onReferralTypeChange);

    this.employeeGroups$ = this.assignReferralsService
      .getEmployees()
      .pipe(tap(x => console.log(x)));
    this.groups$ = this.employeeGroups$.pipe(map(this.setupGroups));
    this.filteredGroups$ = this.employeeGroups$.pipe(
      map(gs => {
        return gs.map(g => ({
          specialtyCode: g.specialtyCode,
          employees: this.sortE(g.employees.filter(this.filterEmployee)),
        }));
      })
    );
  }

  private filterEmployee = (e: EmployeeItem): boolean => {
    const predicateFunctions = this.predicates.map(p => p.f);
    return allPass(predicateFunctions)(e);
  }

  private disableForRecentAssignments(showingRecent: boolean) {
    this.isDisabled = showingRecent;
  }

  private setupGroups(groups: ReadonlyArray<EmployeeGroup>): GroupCodes {
    return [ALL_GROUPS].concat(groups.map(g => g.specialtyCode));
  }

  private togglePredicates(b: boolean, names: ReadonlyArray<PredicateName>) {
    const action = b ? removePredicates : addPredicates;
    this.predicates = action(names, this.predicates);
    this.assignReferralsService.refreshEmployees();
  }

  onGroupDropdown(group: EmployeeGroup['specialtyCode']) {
    this.predicates = updateGroupPredicate(group, this.predicates);
    this.assignReferralsService.refreshEmployees();
  }

  onShowAll(isChecked: boolean) {
    this.togglePredicates(isChecked, ['offIRs']);
  }

  onShowNotAvailable(isChecked: boolean) {
    this.togglePredicates(isChecked, ['available3_5']);
  }

  onShowAboveAverageReferralsPerFTE(isChecked: boolean) {
    this.togglePredicates(isChecked, ['ltAvgFTE']);
  }

  onSearch(searchText: string) {
    this.predicates = updateSearchPredicate(searchText, this.predicates);
    this.assignReferralsService.refreshEmployees();
  }

  onDrop(e: CdkDragDrop<any>) {
    if (this.isSameTable(e.container, e.previousContainer)) {
      return;
    }

    this.assignReferralsService.removeEmployeeFromReferral(e.previousContainer.data);
  }

  private isSameTable(c1: CdkDropList, c2: CdkDropList): boolean {
    return c1.element.nativeElement.parentElement === c2.element.nativeElement.parentElement;
  }

  private onReferralTypeChange = (type: ReferralFilerType) => {
    this.is10DayType = type === '10D';
    this.updateColumns(type);
    this.sortEmployees(type);
    this.setDefaultFilters(type);
    this.assignReferralsService.refreshEmployees();
  }

  private updateColumns = (type: ReferralFilerType) => {
    const colsToExclude: ReadonlyArray<EmployeeColumn['field']> =
      type === 'IR'
        ? ['referralPerFTE', 'tenDayCount', 'referralCount']
        : ['irPercent', 'totalDaysAvailable', 'hadIRYesterday', 'todaysIRs'];

    this.selectedColumnNames = without(colsToExclude, this.getAllColumnFields());
    this.columnsForHideDropdown = columnsMaster.filter(c => !colsToExclude.includes(c.field));
    this.updateDisplayedColumns();
    // this.cdr.detectChanges();
  }

  onHideColumnInit(checkedNames: Array<EmployeeColumn['field']>) {
    this.selectedColumnNames = checkedNames;
    this.updateDisplayedColumns();
  }

  onHideColumnChange({ name, isChecked }: HideColumnIsChecked<EmployeeColumn['field']>) {
    this.selectedColumnNames = isChecked
      ? this.selectedColumnNames.concat([name])
      : (this.selectedColumnNames = without([name], this.selectedColumnNames));

    this.updateDisplayedColumns();
  }

  private updateDisplayedColumns() {
    const inSelectedColumns = (c: EmployeeColumn) => this.selectedColumnNames.includes(c.field);
    this.displayedColumns = columnsMaster.filter(inSelectedColumns);
  }

  private sortEmployees = (type: ReferralFilerType) => {
    const byIRYesterday = ascend<EmployeeItem>(prop('hadIRYesterday'));
    const byIRPercent = ascend<EmployeeItem>(prop('irPercent'));
    const byReferralsPerFTE = ascend<EmployeeItem>(prop('referralPerFTE'));

    const sortList = type === 'IR' ? [byIRPercent, byIRYesterday] : [byReferralsPerFTE];
    this.sortE = sortWith(sortList);
  }

  private setDefaultFilters = (type: ReferralFilerType) => {
    this.predicates = getDefaultPredicates(type);
  }

  private getAllColumnFields(): Array<EmployeeColumn['field']> {
    return columnsMaster.map(c => c.field);
  }

  logPredicates() {
    console.log(this.predicates.map(p => p.name));
    console.log(this.sortE);
  }
}
