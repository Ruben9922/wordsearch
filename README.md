# Wordsearch
Web application that allows one to easily generate wordsearches, made using [Meteor](https://www.meteor.com/).

## Features
*   Create wordsearches using the wordsearch size and words to place in the wordsearch
*   Easily regenerate wordsearches using the same options
*   Words are placed either vertically, horizontally, diagonally downwards or diagonally upwards
*   Words can overlap (only on the same letter of course), as long as they don't overlap completely
*   Choose whether words may be placed backwards
*   Choose whether to add parts of words to make the game more difficult (e.g. a wordsearch containing the word "awesomeness" might also contain parts of that word such as "awe" or "awesome")

## Future Updates
*   Add ability to download as PDF

    I've tried [ongoworks:pdf](https://atmospherejs.com/ongoworks/pdf), but it didn't seem to support formatting of text and didn't seem to display tables very well (as of August 2016). However, I've only tried `saveAsPDF` method and not the `outputAsPDF` method.
