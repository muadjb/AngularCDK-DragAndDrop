import { append, complement, filter, reject, union } from 'ramda';
import { EmployeeGroup, EmployeeItem, ReferralFilerType } from 'models/assign-referrals';
import { isNilOrEmpty } from '@app/utilities';

type Code = EmployeeGroup['specialtyCode'];

export type PredicateName =
  | 'group'
  | 'nameSearch'
  | 'ltAvgFTE'
  | 'available3_5'
  | 'offIRs'
  | 'off10Days';

type PredicateFunction = (e: EmployeeItem) => boolean;

interface Predicate {
  name: PredicateName;
  f: PredicateFunction;
}
export type Predicates = Array<Predicate>;

const namesMatch = (name: string) => (p: Predicate) => p.name === name;

/*
 *  Groups Predicate
 */
export const ALL_GROUPS = '-All-';
const groupEquals = (code: Code) => (employee: EmployeeItem): boolean =>
  code === ALL_GROUPS ? true : employee.specialtyCode === code;

function addGroup(group: EmployeeGroup['specialtyCode'], predicates: Predicates): Predicates {
  const p: Predicate = { name: 'group', f: groupEquals(group) };
  return append(p, predicates);
}

export function updateGroupPredicate(
  group: EmployeeGroup['specialtyCode'],
  predicates: Predicates
): Predicates {
  const noGroup = removePredicates(['group'], predicates);
  return group === ALL_GROUPS ? noGroup : addGroup(group, noGroup);
}

/*
 *  Name Search Predicate
 */
const nameMatchesSearch = (regex: RegExp) => (e: EmployeeItem): boolean =>
  regex.test(e.socialWorker);

function addSearch(searchText: string, predicates: Predicates): Predicates {
  const regex = RegExp(searchText, 'i');
  const p: Predicate = { name: 'nameSearch', f: nameMatchesSearch(regex) };
  return append(p, predicates);
}

export function updateSearchPredicate(searchText: string, predicates: Predicates): Predicates {
  const noSearch = removePredicates(['nameSearch'], predicates);
  return isNilOrEmpty(searchText) ? noSearch : addSearch(searchText, noSearch);
}

/*
 *  Checkbox Predicates
 */
const lessThanAverageFTE: PredicateFunction = e => e.lessThanAvgRPF;
const availableThreeOfNextFiveDays: PredicateFunction = e => e.isHere3of5Days;
const offIRs: PredicateFunction = e => e.offIRs;
const notOffIRs = complement(offIRs);
const off10Days: PredicateFunction = e => e.off10Days;
const notOff10Days = complement(off10Days);

const defaultPredictes: Predicates = [
  { name: 'available3_5', f: availableThreeOfNextFiveDays },
  { name: 'ltAvgFTE', f: lessThanAverageFTE },
  { name: 'offIRs', f: notOffIRs },
  { name: 'off10Days', f: notOff10Days },
  // { name: 'nameSearch', f: nameMatchesSearch },
];

export function getDefaultPredicates(type: ReferralFilerType): Predicates {
  return type === 'IR'
    ? addPredicates(['offIRs'], [])
    : addPredicates(['off10Days', 'available3_5', 'ltAvgFTE'], []);
}

export function addPredicates(
  names: ReadonlyArray<PredicateName>,
  predicates: Predicates
): Predicates {
  const matches = defaultPredictes.filter(p => names.includes(p.name));

  return union(predicates, matches);
}

export function removePredicates(
  names: ReadonlyArray<PredicateName>,
  predicates: Predicates
): Predicates {
  return names.reduce((ps, name) => reject(namesMatch(name), ps), predicates);
}
