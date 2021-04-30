# Wordsearch

[![Build Status](https://travis-ci.com/Ruben9922/wordsearch.svg?branch=master)](https://travis-ci.com/Ruben9922/wordsearch)

Web application that allows one to easily generate wordsearches, made using React.

## Features
*   Create wordsearches by inputting a list of words and the size of the wordsearch
*   Words are placed either vertically, horizontally, diagonally downwards or diagonally upwards
*   Words can overlap (only on the same letter of course), as long as they don't overlap completely
*   Choose whether words may be placed backwards
*   Choose whether to add parts (substrings) of words to make the game more difficult (e.g. a wordsearch containing the word "awesomeness" might also contain parts of that word such as "awe" or "awesome")
*   Download the wordsearch as a text file

## Future Updates
*   Add ability to download the generated wordsearch as an image or PDF document
*   Remove requirement for wordsearches to be square (i.e. number of rows and number of columns always being equal)
*   Add option to automatically generate the word bank using a dictionary API such as Wordnik
*   Add ability to actually play the wordsearch
    -   Identify words using drag-and-drop or clicking (click on start and end letter)
    -   Maybe have cooldown timer to stop this being abused
