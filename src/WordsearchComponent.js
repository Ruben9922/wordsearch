import React from 'react';
import * as R from "ramda";
import {makeStyles, Paper} from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles(theme => ({
  cell: {
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "4px",
    textAlign: "center",
  },
  highlighted: {
    backgroundColor: "#0E6EB8",
    color: "white",
  },
}));

// TODO: Change highlighting to use word IDs instead of array indices
export default function WordsearchComponent({
  wordsearch,
  words,
  highlightedWordIds,
}) {
  const classes = useStyles();

  return (
    <Paper elevation={3} style={{ padding: "0.5em", display: "inline-block", maxWidth: "100%", overflowX: "auto" }}>
      <table className="wordsearch">
        <tbody>
        {wordsearch.map((row, index1) => (
          <tr key={index1}>
            {row.map((cell, index2) => (
              <td
                key={index2}
                className={classNames(classes.cell, {
                  [classes.highlighted]: !R.isEmpty(R.intersection(cell.wordIds, highlightedWordIds))
                })}
              >
                {cell.letter}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </Paper>
  );
}
