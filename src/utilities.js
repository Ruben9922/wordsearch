import * as R from "ramda";

export const likeSet = R.pipe(R.sortBy(R.identity), R.uniq);
