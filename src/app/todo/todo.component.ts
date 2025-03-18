import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  animations: [
    trigger('todoAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Todo = this.createEmptyTodo();
  editingTodo: Todo | null = null;
  filter: 'all' | 'active' | 'completed' = 'all';

  ngOnInit(): void {
    // Lade gespeicherte ToDos aus dem localStorage, falls vorhanden
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
  }

  // Helfer-Methode zum Erstellen eines leeren Todo-Objekts
  createEmptyTodo(): Todo {
    return {
      id: Date.now(),
      title: '',
      description: '',
      completed: false,
      createdAt: new Date()
    };
  }

  // Todo hinzufügen
  addTodo(): void {
    if (this.newTodo.title.trim() === '') return;
    
    this.todos.unshift({ ...this.newTodo });
    this.newTodo = this.createEmptyTodo();
    this.saveTodos();
  }

  // Todo aktualisieren
  updateTodo(todo: Todo): void {
    const index = this.todos.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.todos[index] = { ...todo };
      this.saveTodos();
    }
    this.editingTodo = null;
  }

  // Todo löschen
  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  // Todo-Status umschalten (erledigt/nicht erledigt)
  toggleComplete(todo: Todo): void {
    todo.completed = !todo.completed;
    this.saveTodos();
  }

  // Bearbeitungsmodus für ein Todo starten
  startEditing(todo: Todo): void {
    this.editingTodo = { ...todo };
  }

  // Bearbeitungsmodus abbrechen
  cancelEditing(): void {
    this.editingTodo = null;
  }

  // Speichern der Todos im localStorage
  saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  // Gefilterte Todos zurückgeben basierend auf dem aktuellen Filter
  get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }
}