let todoList = {
	// create a blank array of todos
	todos: [],
	// add a new todo with text of "todo"
	addTodo: function(todo) {
		this.todos.push({
			todoText: todo,
			complete: false
		});
	},
	// remove a todo from the position
	removeTodo: function(position) {
		this.todos.splice(position, 1);
		view.displayTodos();
	},
	// change the todo of the selcted position with the text input passed to the function
	changeTodo: function(position, todo) {
		this.todos[position].todoText = todo;
		this.todos[position].complete = false;
		view.displayTodos();
	},
	// remove all todos from the list
	removeAll: function() {
		this.todos.splice(0, this.todos.length);
		view.displayTodos();
	},
	// complete the todo of the selcted position
	completeTodo: function(position) {
		this.todos[position].complete = !this.todos[position].complete;
		view.displayTodos();
	},
	// toggle all todos with complete or incomplete
	completeAll: function() {
		let allTodos = 0;
		let completeTodos = this.todos.length;
		this.todos.forEach(function(element) {
			if (element.complete === true) {
				allTodos++;
			}
		});
		this.todos.forEach(function(element) {
			toggleButton = document.getElementById("toggleButton");
			if (allTodos === completeTodos) {
				element.complete = false;
				toggleButton.className = "btn toggle fa fa-check-circle-o";
			} else {
				element.complete = true;
				toggleButton.className = "btn toggle fa fa-circle-o";
			}	
		});
	},
	// store session locally
	storeSession: function () {
		// Put the object into storage
		localStorage.setItem('todoList', JSON.stringify(todoList));

		// Retrieve the object from storage
		var retrievedObject = localStorage.getItem('todoList');
	}
};

let handlers = {
	// add a new todo to the list
	addTodo: function(todoText) {
		todoList.addTodo(todoText);
		addTodo.value="";
		addTodo.focus();
		view.displayTodos();
	},
	// toggle all the todos
	completeAll: function() {
		todoList.completeAll();
		view.displayTodos();
	},
	// edit the currently selected todo
	editTodo: function(position) {
		todosLi = document.querySelector("[id='" + position + "']");
		text = todosLi.childNodes[1].textContent;
		todosLi.insertBefore(view.createInput(text), todosLi.childNodes[1]);
		todosLi.childNodes[2].textContent = "";
		todosLi.childNodes[1].focus();
	}
};

let view = {
	displayTodos: function() {
		// select the current ul and set it to blank then use the information from the arrayof objects to recreate the ul
		todosUl = document.querySelector("ul");
		todosUl.innerHTML = "";
		let allTodos = 0;
		let completeTodos = todoList.todos.length;
		todoList.todos.forEach(function(element) {
			if (element.complete === true) {
				allTodos++;
			}
		});

		// check how many items are not true and output how many items are left to check off
		itemsLeft = document.getElementById("itemsLeft");
		itemsLeft.textContent = completeTodos - allTodos;

		// for each li item check if complete or not and append the right button image
		todoList.todos.forEach(function(element) {
			toggleButton = document.getElementById("toggleButton");
			if (allTodos === completeTodos) {
				toggleButton.className = "btn toggle fa fa-check-circle-o";
			} else {
				toggleButton.className = "btn toggle fa fa-circle-o";
			}	
		});

		// check each li element and assign it the current completion depending if it's complete or not
		todoList.todos.forEach(function(todo, position) {
			let todoLi = document.createElement("li");
			let todoTextCompletion = "";
			todoTextCompletion = todo.todoText;

			// give the li element the id of the current position put in it the text content and append the buttons
			// append the li itself to the ul
			todoLi.id = position;
			todoLi.textContent = todoTextCompletion;
			todoLi.appendChild(this.createDeleteButton());
			todoLi.insertBefore(this.createCompleteButton(), todoLi.childNodes[0]);

			if (todo.complete === true) {
				todoLi.childNodes[0].className = "btn completeButton fa fa-check-circle-o";
			}

			todosUl.appendChild(todoLi);
		}, this);

		// after displaying, store the current state
		todoList.storeSession();
	},

	// create a new delete button where this function is called
	createDeleteButton: function() {
		let deleteButton = document.createElement("button");
		deleteButton.className = "btn deleteButton fa fa-times";
		return deleteButton;
	},

	setUpEventListeners: function() {

		// events handling the input inside ul
		// on delete and complete button click event
		let todosUl = document.querySelector("ul");
		todosUl.addEventListener("click", function(event) {
			if(event.target.className === "btn deleteButton fa fa-times") {
				todoList.removeTodo(parseInt(event.target.parentNode.id));
			}
			if(event.target.className === "btn completeButton fa fa-circle-o" || event.target.className === "btn completeButton fa fa-check-circle-o") {
				todoList.completeTodo(parseInt(event.target.parentNode.id));
			}
		});

		// double clicking on the li item click event
		todosUl.addEventListener("dblclick", function(event) {
			if(event.target.id) {
				handlers.editTodo(parseInt(event.target.id));
			}
		});

		// on lost focus from an edited element of the ul, save the input
		todosUl.addEventListener("focusout", function(event) {
			if(event.target.id === "changeInput") {
				todoText = document.getElementById("changeInput");
				todoList.changeTodo(event.target.parentNode.id, todoText.value);
			}
		});

		// on keypress enter, use the input of the edited item and save it into the li
		todosUl.addEventListener("keypress", function(event) {
			if(event.which === 13 && event.target.id === "changeInput") {
				todoText = document.getElementById("changeInput");
				todoList.changeTodo(event.target.parentNode.id, todoText.value);
			}
		});

		// The event that handles input outside of the ul
		// on keypress enter, put the input text into an li element
		let todosAdd = document.querySelector("#addTodo");
		todosAdd.addEventListener("keypress", function(event) {
			if (event.which === 13 && document.getElementById("addTodo").value !== null) {
				handlers.addTodo(document.getElementById("addTodo").value);
			}
		});
	},

	// create a new complete button where this function is called
	createCompleteButton: function() {
		let completeButton = document.createElement("button");
		completeButton.className = "btn completeButton fa fa-circle-o"
		return completeButton;
	},

	// create a new input element where this function is called
	createInput: function(text) {
		let createInput = document.createElement("input");
		createInput.id = "changeInput";
		createInput.type = "text";
		createInput.value = text;
		createInput.focus();
		return createInput;
	}
};

// run event listeners
view.setUpEventListeners();