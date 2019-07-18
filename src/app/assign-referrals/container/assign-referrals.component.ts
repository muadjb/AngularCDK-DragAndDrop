import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeItem } from 'models/assign-referrals';
import { Subscription } from 'rxjs';
import { AssignReferralsService } from '../assign-referrals.service';

type offReferralType = keyof Pick<EmployeeItem, 'offIRs' | 'off10Days'>;
type Compare = (e1: EmployeeItem, e2: EmployeeItem) => number;

@Component({
  selector: 'ams-assign-referrals',
  templateUrl: './assign-referrals.component.html',
  styleUrls: ['./assign-referrals.component.scss'],
})
export class AssignReferralsComponent implements OnInit, OnDestroy {
  private subs = new Subscription();

  showingRecentAssignments = false;

  constructor(private assignReferralsService: AssignReferralsService) {}

  ngOnInit() {
    this.subs.add(
      this.assignReferralsService.showRecentAssignments$.subscribe(
        showing => (this.showingRecentAssignments = showing)
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSave() {
    this.subs.add(this.assignReferralsService.saveAssignments().subscribe());
  }
}
