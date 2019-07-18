import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { zip } from 'ramda';
import {
  UnassignedReferralColumn,
  EmployeeColumn,
  HideColumnIsChecked,
} from 'models/assign-referrals';
import { isNilOrEmpty } from '@app/utilities';

@Component({
  selector: 'ams-hide-columns-dropdown',
  templateUrl: './hide-columns-dropdown.component.html',
  styleUrls: ['./hide-columns-dropdown.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HideColumnsDropdownComponent<T extends UnassignedReferralColumn | EmployeeColumn>
  implements OnInit {
  @Input() columns: T[];
  @Output() changed = new EventEmitter<HideColumnIsChecked<T['field']>>();
  @Output() init = new EventEmitter<Array<T['field']>>();

  private storageKey = '';
  isExpanded = false;
  inputIsChecked: Array<boolean>;

  ngOnInit() {
    this.storageKey = this.columns.map(c => c.field).join(',');
    this.inputIsChecked = this.getCheckStateFromStorage();
  }

  private getCheckStateFromStorage(): Array<boolean> {
    const allChecked: Array<boolean> = this.columns.map(c => true);

    let inputChecked = allChecked;

    if (!isNilOrEmpty(this.storageKey)) {
      const checkState = localStorage.getItem(this.storageKey);

      if (isNilOrEmpty(checkState)) {
        localStorage.setItem(this.storageKey, JSON.stringify(allChecked));
      } else {
        inputChecked = JSON.parse(checkState);
      }
    }

    const namesAndChecks = zip(this.columns.map(c => c.field), inputChecked);
    const checkedNames = namesAndChecks.filter(([n, c]) => c === true).map(([n, c]) => n);
    this.init.emit(checkedNames);
    return inputChecked;
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  onChange(name: T['field'], isChecked: boolean) {
    localStorage.setItem(this.storageKey, JSON.stringify(this.inputIsChecked));
    this.changed.emit({ name, isChecked });
  }
}
