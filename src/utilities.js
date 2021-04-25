import * as R from "ramda";

export function reverseString(string) {
  let result = "";
  for (let i = string.length - 1; i >= 0; i--) {
    result += string.charAt(i);
  }
  return result;
}

export const likeSet = R.pipe(R.sortBy(R.identity), R.uniq);
