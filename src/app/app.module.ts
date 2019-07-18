import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AssignReferralsComponent } from './assign-referrals/container/assign-referrals.component';
import { EmployeesToAssignComponent } from './assign-referrals/employees-to-assign/employees-to-assign.component';
import { RecentAssignmentsComponent } from './assign-referrals/unassigned-referrals/recent-assignments/recent-assignments.component';
import { UnassignedReferralsComponent } from './assign-referrals/unassigned-referrals/unassigned-referrals.component';
import { HideColumnsDropdownComponent } from './assign-referrals/hide-columns-dropdown/hide-columns-dropdown.component';
import { FormsModule } from '@angular/forms';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';

@NgModule({
  declarations: [
    AppComponent,
    AssignReferralsComponent,
    EmployeesToAssignComponent,
    HideColumnsDropdownComponent,
    RecentAssignmentsComponent,
    UnassignedReferralsComponent,
    ToggleButtonComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, DragDropModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
