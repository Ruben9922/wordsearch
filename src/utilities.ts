import * as R from "ramda";

export const likeSet: <T>(l: T[]) => T[] = R.pipe(R.sortBy(R.identity), R.uniq);

export function getEnumLength(e: {[id: number]: string}): number {
  return Object.keys(e).filter(x => !isNaN(Number(x))).length;
}
