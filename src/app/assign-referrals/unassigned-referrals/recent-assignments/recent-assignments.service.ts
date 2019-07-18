import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecentAssignments } from 'models/recent-assignments';
import { Observable, of } from 'rxjs';
import TestRecent from '../../../../test/test-data/recent-assignments.json';

@Injectable({
  providedIn: 'root',
})
export class RecentAssignmentsService {
  constructor(private http: HttpClient) {}

  getRecentAssignments(): Observable<ReadonlyArray<RecentAssignments>> {
    const x = TestRecent.map(r => ({
      ...r,
      intakeDate: new Date(r.intakeDate),
      assignmentDate: null,
    }));
    // const temp:RecentAssignments = {...TestRecent, intakeDate: new Date()}
    return of(x);
    // return of(JSON.parse(TestRecent));
    // this.spinnerService.show();
    // const params = new HttpParams().set('recordCount', count.toString());
    // return this.http.get<Array<RecentAssignments>>(apiUrls.recentAssignments, { params }).pipe(
    //   map(as => sortByPropertyDescending('assignmentDate', as)),
    //   finalize(() => this.spinnerService.hide())
    // );
  }
}
