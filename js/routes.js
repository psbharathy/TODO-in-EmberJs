Todos.Router.map(function() {
    this.resource('todos', {path: '/'},function(){
        this.route('active');
        this.route('completed');
    });
});


// Default route
Todos.TodosRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('todo');
    }
});
// Index route 
Todos.TodosIndexRoute = Ember.Route.extend({
    model:function(){
      // Model for this route is same as TodosRoute model
      return this.modelFor('todos');
    }
});

Todos.TodosActiveRoute = Ember.Route.extend({
    model: function() {
        return this.store.filter('todo',function (todo){
           return !todo.get('isCompleted'); 
        });
    },
    renderTemplate : function(controller) {
        this.render('todos/index',{controller:controller});
    }
});
Todos.TodosCompletedRoute = Ember.Route.extend({
    model: function() {
        return this.store.filter('todo',function (todo){
           return todo.get('isCompleted'); 
        });
    },
    renderTemplate : function(controller) {
        this.render('todos/index',{controller:controller});
    }
});

// todo Data DS Model 
Todos.Todo = DS.Model.extend({
    title: DS.attr('string'),
    isCompleted: DS.attr('boolean')
});


Todos.Todo.FIXTURES = [
    {
        id: 1,
        title: 'Learn Ember.js',
        isCompleted: true
    },
    {
        id: 2,
        title: 'Create  Ember App',
        isCompleted: true
    },
    {
        id: 3,
        title: 'Start Todo Example',
        isCompleted: false
    },
    {
        id: 4,
        title: 'Miles to go ...',
        isCompleted: false
    }
];

Todos.TodoController = Ember.ObjectController.extend({
    actions: {
        editTodo: function() {
            this.set('isEditing', true);
        },
        acceptChanges : function() {
            this.set('isEditing', false);
            if(Ember.isEmpty(this.get('model.title'))) {
                this.send('removeTodo');
            } else {
                this.get('model').save();
            }
        },
        removeTodo : function() {
            var todo = this.get('model');
            todo.deleteRecord();
            todo.save();
        }
    },
    isEditing: false,
    isCompleted: function(key, value) {
        var model = this.get('model');

        if (value === undefined) {
            return model.get('isCompleted');
        } else {
            model.set('isCompleted', value);
            model.save();
            return value;
        }
    }.property('model.isCompleted')
});

Todos.TodosController = Ember.ArrayController.extend({
    actions: {
        createTodo: function() {
            var todoTitle = this.get('newTitle');
            if (!todoTitle.trim()) {
                return;
            }
            var todoNew = this.store.createRecord('todo', {
                title: todoTitle,
                isCOmpleted: false
            });
            this.set('newTitle', '');
            todoNew.save();
        },
        clearCompleted : function() {
            var completed = this.filterBy('isCompleted',true);
            completed.invoke('deleteRecord');
            completed.invoke('save');
        }
    },
    allAreDone:function(key,value) {
      if(value === undefined) {
        return !!this.get('length') && this.isEvery('isCompleted')       
      } else {
          this.setEach('isCompleted',value);
          this.invoke('save');
          return value;
      }
    }.property('@each.isCompleted'),    
    remaining:function() {
        return this.filterPoperty('isCompleted',false).get('length');
    }.property('@each.isCompleted'),
    
    hasCompleted: function() {
       return this.get('completed') > 0; 
    }.property('completed'),
    completed :function() {
        return this.filterProperty('isCompleted',true).get('length');
    }.property('@each.isCompleted'),
    notCompleted: function() {
        return this.filterBy('isCompleted', false).get('length');
    }.property('@each.isCompleted'),
    
    inflection: function() {
        var notCompleted = this.get('notCompleted');
        return notCompleted === 1 ? 'item' : 'items';
    }.property('notCompleted')
});
// Render edit template view 
Todos.EditTodoView = Ember.TextField.extend({
  didInsertElement: function() {
    this.$().focus();
  }
});
// Helper 
Ember.Handlebars.helper('edit-todo', Todos.EditTodoView);