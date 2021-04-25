import React, {Component} from 'react';
import './WordsearchComponent.css';
import DownloadComponent from "./DownloadComponent";
import * as R from "ramda";

// TODO: Change highlighting to use word IDs instead of array indices
export default function WordsearchComponent({
  wordsearch,
  highlightedWordIds,
}) {
  return (
    <React.Fragment>
      <div>
        <table className="wordsearch">
          <tbody>
          {wordsearch.map((row, index1) => (
            <tr key={index1}>
              {row.map((cell, index2) => (
                <td
                  key={index2}
                  className={cell.wordId !== null && R.includes(cell.wordId, highlightedWordIds) ? "highlighted" : undefined}
                >
                  {cell.letter}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <DownloadComponent wordsearch={wordsearch} />
    </React.Fragment>
  );
}
