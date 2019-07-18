import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecentAssignmentsService } from './recent-assignments.service';
import { Observable } from 'rxjs';
import { RecentAssignmentsColumn, RecentAssignments } from 'models/recent-assignments';

const columnsMaster: RecentAssignmentsColumn[] = [
  { field: 'intakeDate', header: 'Intake' },
  { field: 'referralTypeID', header: 'Type' },
  { field: 'cwsRefName', header: 'Ref Name' },
  { field: 'cwsRefNumber', header: 'Ref #' },
  { field: 'incidentZipCode', header: 'Zip' },
  { field: 'regionDescription', header: 'Region' },
  { field: 'specialSkill', header: 'Language' },
  { field: 'specialRequest', header: 'Request' },
  { field: 'assignedTo', header: 'Assigned To' },
  { field: 'assignmentDate', header: 'Assignment Date' },
];

@Component({
  selector: 'ams-recent-assignments',
  templateUrl: './recent-assignments.component.html',
  styleUrls: ['./recent-assignments.component.scss'],
})
export class RecentAssignmentsComponent implements OnInit {
  columns = columnsMaster;
  recentAssignments$: Observable<ReadonlyArray<RecentAssignments>>;

  constructor(private router: Router, private recentAssignmentsService: RecentAssignmentsService) {}

  ngOnInit() {
    this.recentAssignments$ = this.recentAssignmentsService.getRecentAssignments();
  }

  onRowClick(referralId: RecentAssignments['referralId']) {
    this.router.navigate([`referral/edit/${referralId}`]);
  }
}
