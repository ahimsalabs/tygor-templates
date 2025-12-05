package main

// Task represents a todo item.
type Task struct {
	ID        int     `json:"id"`
	Title     string  `json:"title"`
	Completed bool    `json:"completed"`
}

// Version is broadcast to clients when data changes.
type Version struct {
	Value int `json:"value"`
}

// CreateTaskParams for creating a new task.
type CreateTaskParams struct {
	Title string `json:"title" validate:"required,min=1"`
}

// DeleteTaskParams for deleting a task.
type DeleteTaskParams struct {
	ID int `json:"id"`
}

// ToggleTaskParams for toggling task completion.
type ToggleTaskParams struct {
	ID int `json:"id"`
}
