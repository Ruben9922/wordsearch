import React from 'react';
import {Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Paper} from "@material-ui/core";
import * as R from "ramda";
import {likeSet} from "./utilities";

export default function WordsListComponent({
  words,
  highlightedWordIds,
  onHighlightedWordIdsChange,
}) {
  const allHighlighted = R.equals(likeSet(R.map(w => w.id, words)), likeSet(highlightedWordIds));

  return (
    <React.Fragment>
      <FormControlLabel
        control={
          <Checkbox
            checked={allHighlighted}
            indeterminate={!R.isEmpty(highlightedWordIds) && !allHighlighted}
            onChange={(event) =>
              onHighlightedWordIdsChange(event.target.checked ? likeSet(R.map(w => w.id, words)) : [])}
          />
        }
        label="Highlight all/none"
      />
      <List>
        {words.map((word, index) => {
          const labelId = `word-list-label-${index}`;

          return (
            <ListItem key={index}
                      role={undefined}
                      button
                      onClick={() => onHighlightedWordIdsChange(highlightedWordIds =>
                        !R.includes(word.id, highlightedWordIds)
                          ? R.union(highlightedWordIds, [word.id])
                          : R.difference(highlightedWordIds, [word.id]))}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={R.includes(word.id, highlightedWordIds)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{'aria-labelledby': labelId}}
                />
              </ListItemIcon>
              <ListItemText primary={word.text} id={labelId} />
            </ListItem>
          );
        })}
      </List>
    </React.Fragment>
  );
}
