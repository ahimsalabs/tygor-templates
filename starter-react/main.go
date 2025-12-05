package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"tygor.dev/tygor"
	"tygor.dev/tygorgen"
)

// In-memory task store (slice preserves creation order)
var (
	tasks   []*Task
	nextID  = 1
	tasksMu sync.RWMutex
)

// Version livevalue - clients subscribe and refetch when it changes
var version = tygor.NewLiveValue(&Version{Value: 0})

func bumpVersion() {
	version.Update(func(v *Version) *Version {
		return &Version{Value: v.Value + 1}
	})
}

// SetupApp configures the tygor application.
func SetupApp() *tygor.App {
	app := tygor.NewApp()
	svc := app.Service("Tasks")

	svc.Register("List", tygor.Query(ListTasks))
	svc.Register("Create", tygor.Exec(CreateTask))
	svc.Register("Toggle", tygor.Exec(ToggleTask))
	svc.Register("Delete", tygor.Exec(DeleteTask))
	svc.Register("Version", version.Handler())

	return app
}

// TygorConfig configures the TypeScript generator.
func TygorConfig(g *tygorgen.Generator) *tygorgen.Generator {
	return g.
		EnumStyle("union").
		OptionalType("undefined").
		WithDiscovery().
		WithFlavor(tygorgen.FlavorZod)
}

func ListTasks(_ context.Context, _ tygor.Empty) ([]*Task, error) {
	tasksMu.RLock()
	defer tasksMu.RUnlock()
	return tasks, nil
}

func CreateTask(_ context.Context, p *CreateTaskParams) (*Task, error) {
	tasksMu.Lock()
	defer tasksMu.Unlock()

	task := &Task{
		ID:    nextID,
		Title: p.Title,
	}
	tasks = append([]*Task{task}, tasks...)
	nextID++

	bumpVersion()
	return task, nil
}

func ToggleTask(_ context.Context, p *ToggleTaskParams) (*Task, error) {
	tasksMu.Lock()
	defer tasksMu.Unlock()

	for _, task := range tasks {
		if task.ID == p.ID {
			task.Completed = !task.Completed
			bumpVersion()
			return task, nil
		}
	}
	return nil, fmt.Errorf("task %d not found", p.ID)
}

func DeleteTask(_ context.Context, p *DeleteTaskParams) (tygor.Empty, error) {
	tasksMu.Lock()
	defer tasksMu.Unlock()

	for i, task := range tasks {
		if task.ID == p.ID {
			tasks = append(tasks[:i], tasks[i+1:]...)
			bumpVersion()
			return nil, nil
		}
	}
	return nil, fmt.Errorf("task %d not found", p.ID)
}

func main() {
	port := flag.String("port", "8080", "Server port")
	flag.Parse()

	if p := os.Getenv("PORT"); p != "" {
		*port = p
	}

	app := SetupApp()

	addr := ":" + *port
	fmt.Printf("Server listening on %s\n", addr)
	if err := http.ListenAndServe(addr, app.Handler()); err != nil {
		log.Fatal(err)
	}
}
