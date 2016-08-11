function reverseString(string) {
  var result = '';
  for (var i = string.length - 1; i >= 0; i--) {
    result += string[i];
  }
  return result;
}

// Generates a `size` x `size` wordsearch using given array of words
// Returns 2D array
function generateWordsearch(size, words) {
  var wordsearch = new Array(size);
  for (var i = 0; i < wordsearch.length; i++) {
    wordsearch[i] = new Array(size);
    for (var j = 0; j < wordsearch[i].length; j++) {
      wordsearch[i][j] = '-';
    }
  }

  //console.log('----------');
  // Place each of the words given in the words array into the wordsearch array
  for (var i = 0; i < words.length; i++) {
    var word = words[i].toUpperCase(); // Need to check if word can fit
    // Randomly choose direction of word and whether word should be backwards
    var direction = Math.floor(Math.random() * 4);
    var backwards = Math.random() >= 0.5;
    if (backwards) {
      word = reverseString(word);
    }
    placeWord(wordsearch, word, direction);
  }

  return wordsearch;
}

function placeWord(wordsearch, word, direction) {
  // Height and width store how much space the word takes up to ensure whole of word is placed inside wordsearch
  var height = (direction === directions.HORIZONTAL ? 1 : word.length);
  var width = (direction === directions.VERTICAL ? 1 : word.length);
  var wordOrigin = {
    row: Math.floor(Math.random() * (wordsearch.length + 1 - height)),
    column: Math.floor(Math.random() * (wordsearch[0].length + 1 - width))
  };

  //console.log('dir ' + direction);
  for (var j = 0; j < word.length; j++) {
    var rowIncrement = (direction === directions.VERTICAL || direction === directions.DIAGONAL_DOWN ? j : (direction === directions.DIAGONAL_UP ? j : 0)); // Need to get DIAGONAL_UP to work
    var columnIncrement = (direction === directions.HORIZONTAL || direction === directions.DIAGONAL_DOWN || direction === directions.DIAGONAL_UP ? j : 0);
    //console.log('Placing letter ' + word.charAt(j) + ' at ' + (wordOrigin.row + rowIncrement) + ',' + (wordOrigin.column + columnIncrement));
    wordsearch[wordOrigin.row + rowIncrement][wordOrigin.column + columnIncrement] = word.charAt(j);
  }
}

Session.setDefault('showNewWordsearch', false);
Session.setDefault('size', 0);
Session.setDefault('words', []);

// Declare "enum" for directions
var directions = Object.freeze({
  VERTICAL: 0,
  HORIZONTAL: 1,
  DIAGONAL_DOWN : 2,
  DIAGONAL_UP: 3
});

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
// Simply returns whether given number is greater than 1
Template.home.helpers({
  'showNewWordsearch': function() {
    return Session.get('showNewWordsearch');
  }
});

Template.create.onCreated(function() {
  this.size = new ReactiveVar(0);
  this.words = new ReactiveVar([]);
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
        regex: "^[a-zA-Z]+(?:\\s[a-zA-Z]+)*(?:,[a-zA-Z]+(?:\\s[a-zA-Z]+)*){0,50}$"
      }
    },
    messages: {
      words: {
        regex: "You must enter up to 50 words/phrases, separated by commas.<br>The words/phrases must consist only of letters and spaces, and begin and end with a letter."
      }
    },
    submitHandler: function(event) {
      var size = $('[name=size]').val();
      var words = $('[name=words]').val().split(',');
      Session.set('size', size);
      Session.set('words', words);
      Session.set('showNewWordsearch', true);
    }
  })
});

Template.create.helpers({
  'size': function() {
    return Template.instance().size.get();
  },
  'words': function() {
    return Template.instance().words.get();
  },
  // Since Meteor currently doesn't support @last (or similar) in templates
  'wordsString': function() {
    var words = Template.instance().words.get();
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
  'input #size': function(event, template) {
    var sizeInput = $(event.target);
    if (sizeInput.valid()) {
      var size = Number(sizeInput.val());
      template.size.set(size);
    } else {
      template.size.set(0);
    }
  },
  'input #words': function(event, template) {
    var wordsInput = $(event.target);
    if (wordsInput.valid()) {
      var words = wordsInput.val().split(',');
      template.words.set(words);
    } else {
      template.words.set([]);
    }
  },
  'submit form': function(event) {
    event.preventDefault();
  }
});

Template.newWordsearch.onCreated(function() {
  this.wordsearch = new ReactiveVar([]);
  var size = Number(Session.get('size')); // Could set `size` session variable as a Number
  var words = Session.get('words');
  var wordsearch = generateWordsearch(size, words);
  Template.instance().wordsearch.set(wordsearch);
  //console.log(wordsearch);
});

Template.newWordsearch.helpers({
  'wordsearch': function() {
    return Template.instance().wordsearch.get();
  }
});

Template.newWordsearch.events({
  'click #createAnotherWordsearchButton': function() {
    Session.set('showNewWordsearch', false);
  },
  'click #regenerateWordsearchButton': function(event, template) {
    var size = Number(Session.get('size'));
    var words = Session.get('words');
    var wordsearch = generateWordsearch(size, words);
    template.wordsearch.set(wordsearch);
  }
})
