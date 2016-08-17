function reverseString(string) {
  var result = '';
  for (var i = string.length - 1; i >= 0; i--) {
    result += string.charAt(i);
  }
  return result;
}

// Generates a size x size wordsearch using given array of words
// Returns 2-dimensional array
function generateWordsearch(size, words, allowBackwards, allowWordParts) {
  var wordsearch = new Array(size);
  for (var i = 0; i < wordsearch.length; i++) {
    wordsearch[i] = new Array(size);
    for (var j = 0; j < wordsearch[i].length; j++) {
      wordsearch[i][j] = null;
    }
  }

  //console.log('----------');
  // Place each of the words given in the words array into the wordsearch array
  for (var i = 0; i < words.length; i++) {
    var word = words[i].toUpperCase(); // Need to check if word can fit
    if (placeWord(wordsearch, word, allowBackwards) === null) {
      return null;
    }
  }

  // If allowWordParts true, also place parts of some of the entered words as red herrings
  // May result in whole words being placed more than once by coincidence, but unlikely and also could change later
  // Will change to allow multiple red herrings per word
  // Need to update README.md
  if (allowWordParts) {
    for (var i = 0; i < Math.floor(Math.random() * words.length); i++) {
      var word = words[i].slice(0, Math.floor(Math.random() * words[i].length)).toUpperCase();
      if (placeWord(wordsearch, word, allowBackwards) === null) {
        return null;
      }
    }
  }

  fillWithRandomLetters(wordsearch);

  return wordsearch;
}

function placeWord(wordsearch, word, allowBackwards) {
  // Randomly choose direction of word and whether word should be backwards
  var direction = Math.floor(Math.random() * 4);
  var backwards = allowBackwards && Math.random() >= 0.5;

  if (backwards) {
    word = reverseString(word); // Might be quicker to place directly into wordsearch in reverse rather than reverse beforehand
  }
  var successful;
  var attemptCount = 0;
  do {
    successful = placeString(wordsearch, word, direction);
  } while (!successful && ++attemptCount < MAX_ATTEMPT_COUNT);
  if (!successful) {
    return null;
  }
}

function placeString(wordsearch, word, direction) {
  // Height and width store how much space the word takes up to ensure whole of word is placed inside wordsearch
  var height = (direction === directions.HORIZONTAL ? 1 : word.length);
  var width = (direction === directions.VERTICAL ? 1 : word.length);
  // Word origin stores where word 'starts'
  // First letter is placed here then remaining letters are placed incrementally further away in chosen direction
  var wordOrigin = {
    row: Math.floor((Math.random() * (wordsearch.length + 1 - height)) + (direction === directions.DIAGONAL_UP ? height - 1 : 0)),
    column: Math.floor(Math.random() * (wordsearch[0].length + 1 - width))
  };
  var letterPositions = new Array(word.length);
  var oldLetters = new Array(word.length);

  // Place each letter into wordsearch according to chosen direction
  //console.log('dir ' + direction);
  for (var j = 0; j < word.length; j++) {
    // Letter position stores position of letter relative to word origin
    var letterPosition = {
      row: (direction === directions.VERTICAL || direction === directions.DIAGONAL_DOWN ? j : (direction === directions.DIAGONAL_UP ? -j : 0)),
      column: (direction === directions.HORIZONTAL || direction === directions.DIAGONAL_DOWN || direction === directions.DIAGONAL_UP ? j : 0)
    };

    var row = wordOrigin.row + letterPosition.row;
    var column = wordOrigin.column + letterPosition.column;
    var currentValue = wordsearch[row][column];
    var letter = word.charAt(j);
    //console.log('CU ' + currentValue);
    // If value at chosen position (currentValue) is null or same letter as the letter to be placed,
    // and if current letter is not the last letter and same as currentValue (to prevent words completely overlapping),
    // place word in wordsearch and add to letterPosition array after storing current value
    // Otherwise replace all letters from this word that have been placed in the wordsearch with their previous values
    if ((currentValue === null || currentValue === letter) && !(j === word.length - 1 && currentValue === letter)) {
      //console.log('Placing letter ' + letter + ' at ' + row + ',' + column);
      oldLetters[j] = currentValue;
      //console.log(oldLetters[j]);
      wordsearch[row][column] = letter;
      letterPositions[j] = letterPosition;
    } else {
      // Replace first j letters in this word, which have already been placed in wordsearch, with previous values
      // Does this since checking cells before placing word would also have worst-case time of O(n^2) but may happen more often - might change this later
      for (var k = 0; k < j; k++) {
        //console.log('Erasing letter at ' + (wordOrigin.row + letterPositions[k].row) + ',' + (wordOrigin.column + letterPositions[k].column));
        wordsearch[wordOrigin.row + letterPositions[k].row][wordOrigin.column + letterPositions[k].column] = oldLetters[k];
      }
      return false;
    }
  }
  return true;
}

function fillWithRandomLetters(wordsearch) {
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < wordsearch.length; i++) {
    for (var j = 0; j < wordsearch[i].length; j++) {
      if (wordsearch[i][j] === null) {
        wordsearch[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

Session.setDefault('showNewWordsearch', false);
Session.setDefault('size', 0);
Session.setDefault('words', []);
Session.setDefault('allowBackwards', true);
Session.setDefault('allowWordParts', false);

// Declare "enum" for directions
var directions = Object.freeze({
  VERTICAL: 0,
  HORIZONTAL: 1,
  DIAGONAL_DOWN : 2,
  DIAGONAL_UP: 3
});
var MAX_ATTEMPT_COUNT = 30;
var MAX_WORD_COUNT = 50;

// Set validator defaults and add additional validation methods
$.validator.setDefaults({
  // From Stack Overflow - http://stackoverflow.com/a/18754780/3806231
  // Author: Miguel Borges (http://stackoverflow.com/users/811421/miguel-borges)
  highlight: function(element) {
    $(element).closest('.form-group').addClass('has-error');
  },
  unhighlight: function(element) {
    $(element).closest('.form-group').removeClass('has-error');
  },
  errorElement: 'span',
  errorClass: 'help-block',
  errorPlacement: function(error, element) {
    if(element.parent('.input-group').length) {
      error.insertAfter(element.parent());
    } else {
      error.insertAfter(element);
    }
  }
});

// Checks whether the value is matched by the given regular expression
// From Stack Overflow - http://stackoverflow.com/a/709358/3806231
// Author: PeterFromCologne (http://stackoverflow.com/users/36546/peterfromcologne)
$.validator.addMethod(
  "regex",
  function(value, element, expression) {
    var regexp = new RegExp(expression);
    return this.optional(element) || regexp.test(value);
  },
  "Please check your input."
);

// Add template helpers, events and callbacks
Template.home.helpers({
  'showNewWordsearch': function() {
    return Session.get('showNewWordsearch');
  }
});

Template.create.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('size', 0);
  this.state.set('words', []);
});

Template.create.onRendered(function() {
  $('form').validate({
    rules: {
      size: {
        required: true,
        digits: true,
        min: 1,
        max: 40
      },
      words: {
        required: true,
        regex: "^[a-zA-Z]+(?:\\s[a-zA-Z]+)*(?:,[a-zA-Z]+(?:\\s[a-zA-Z]+)*){0," + (MAX_WORD_COUNT - 1) + "}$"
      }
    },
    messages: {
      words: {
        regex: "" // #words-error still appears causing extra spacing to appear
      }
    },
    submitHandler: function(event) {
      var size = Number($('[name=size]').val());
      var words = $('[name=words]').val().split(',');
      var allowBackwards = $('.js-allow-backwards').prop('checked');
      var allowWordParts = $('.js-allow-word-parts').prop('checked');
      Session.set('size', size);
      Session.set('words', words);
      Session.set('showNewWordsearch', true);
      Session.set('allowBackwards', allowBackwards);
      Session.set('allowWordParts', allowWordParts);
    }
  })
});

Template.create.helpers({
  'size': function() {
    return Template.instance().state.get('size');
  },
  'words': function() {
    return Template.instance().state.get('words');
  },
  'maxWordCount': function() {
    return MAX_WORD_COUNT;
  },
  // Since Meteor currently doesn't support @last (or similar) in templates
  'wordsString': function() { // Could replace with a $last in the template
    var words = Template.instance().state.get('words');
    var wordsString = words.join(", ");
    // Replace last instance of ', ' in string with ' and '
    // From a comment on Stack Overflow - http://stackoverflow.com/a/2729686/3806231
    // Author: Ben Gotow (http://stackoverflow.com/users/100363/ben-gotow)
    var n = wordsString.lastIndexOf(", ");
    if (n != -1) {
      wordsString = wordsString.substr(0, n) + " and " + wordsString.substr(n + 2);
    }
    return wordsString;
  }
});

Template.create.events({
  'input [name=size]': function(event, template) {
    var sizeInput = $(event.target);
    if (sizeInput.valid()) {
      var size = Number(sizeInput.val());
      template.state.set('size', size);
    } else {
      template.state.set('size', 0);
    }
  },
  'input [name=words]': function(event, template) {
    var wordsInput = $(event.target);
    if (wordsInput.valid()) {
      var words = wordsInput.val().split(',');
      template.state.set('words', words);
    } else {
      template.state.set('words', []);
    }
  },
  'submit form': function(event) {
    event.preventDefault();
  }
});

Template.newWordsearch.onCreated(function() {
  this.wordsearch = new ReactiveVar([]);
  var size = Session.get('size'); // Should probably validate session variables before use
  var words = Session.get('words');
  var allowBackwards = Session.get('allowBackwards');
  var allowWordParts = Session.get('allowWordParts');
  var wordsearch = generateWordsearch(size, words, allowBackwards, allowWordParts);
  this.wordsearch.set(wordsearch);
  //console.log(wordsearch);
});

Template.newWordsearch.helpers({
  'wordsearch': function() {
    return Template.instance().wordsearch.get();
  },
  'maxAttemptCount': function() {
    return MAX_ATTEMPT_COUNT;
  },
  'words': function() {
    return Session.get('words');
  }
});

Template.newWordsearch.events({
  'click .js-change-options': function() {
    Session.set('showNewWordsearch', false);
  },
  'click .js-regenerate-wordsearch': function(event, template) {
    var size = Session.get('size');
    var words = Session.get('words');
    var allowBackwards = Session.get('allowBackwards');
    var allowWordParts = Session.get('allowWordParts');
    var wordsearch = generateWordsearch(size, words, allowBackwards, allowWordParts);
    template.wordsearch.set(wordsearch);
    //console.log(wordsearch);
  }
})
