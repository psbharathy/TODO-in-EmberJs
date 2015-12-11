Todos = Ember.Application.create();
// Adapters are responsible for communicating with a source of data for App
//Todos.ApplicationAdapter = DS.FixtureAdapter.extend();

Todos.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'todos-emberjs'
});
