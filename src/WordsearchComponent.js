import React, {Component} from 'react';
import './WordsearchComponent.css';
import DownloadComponent from "./DownloadComponent";
import * as R from "ramda";
import {Paper} from "@material-ui/core";

// TODO: Change highlighting to use word IDs instead of array indices
export default function WordsearchComponent({
  wordsearch,
  words,
  highlightedWordIds,
}) {
  return (
    <Paper elevation={3} style={{ padding: "0.5em", display: "inline-block", maxWidth: "100%", overflowX: "auto" }}>
      <table className="wordsearch">
        <tbody>
        {wordsearch.map((row, index1) => (
          <tr key={index1}>
            {row.map((cell, index2) => (
              <td
                key={index2}
                className={!R.isEmpty(R.intersection(cell.wordIds, highlightedWordIds)) ? "highlighted" : undefined}
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
