import { format } from 'date-fns';
import { all, anyPass, ascend, complement, descend, isEmpty, isNil, prop, sort } from 'ramda';

export const allTrue = all(x => x === true);
export const allFalse = all(x => !x);
export const isNilOrEmpty = anyPass([isNil, isEmpty]);
export const notNil = complement(isNil);

export const formatDateForAPI = (d: Date): string => (d ? format(d, 'MM/DD/YYYY') : '');

export function sortByPropertyAscending<P extends keyof T, T>(property: P, obj: T[]): T[] {
  return sort(ascend(prop(property.toString())), obj);
}

export function sortByPropertyDescending<P extends keyof T, T>(property: P, obj: T[]): T[] {
  return sort(descend(prop(property.toString())), obj);
}
