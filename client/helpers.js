// Global template helpers
Template.registerHelper('isCurrent', function(routeName) {
  var currentRouteName = Router.current().route.getName();
  return currentRouteName === routeName;
});

Template.registerHelper('isArrayEmpty', function(array) {
  return array.length === 0;
});

Template.registerHelper('last', function(list, element) {
  return _.last(list) === element;
});
