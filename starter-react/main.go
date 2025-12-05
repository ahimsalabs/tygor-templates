package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"tygor.dev/tygor"
	"tygor.dev/tygorgen"
)

// Atom holding message state - subscribers get current value and updates
var messageAtom = tygor.NewAtom(&MessageState{
	Message:  "hello",
	SetCount: 0,
})

// SetupApp configures the tygor application.
// This export is used by `tygor gen` for type generation.
func SetupApp() *tygor.App {
	app := tygor.NewApp()

	msg := app.Service("Message")
	msg.Register("State", messageAtom.Handler())
	msg.Register("Set", tygor.Exec(SetMessage))

	timeSvc := app.Service("Time")
	timeSvc.Register("Now", tygor.Stream(StreamTime))

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

func SetMessage(ctx context.Context, req *SetMessageParams) (*MessageState, error) {
	var newState *MessageState
	messageAtom.Update(func(state *MessageState) *MessageState {
		newState = &MessageState{
			Message:  req.Message,
			SetCount: state.SetCount + 1,
		}
		return newState
	})
	return newState, nil
}

// StreamTime sends the current time every second.
func StreamTime(_ context.Context, _ tygor.Empty, stream tygor.StreamWriter[*TimeUpdate]) error {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for range ticker.C {
		if err := stream.Send(&TimeUpdate{Time: time.Now()}); err != nil {
			return err
		}
	}
	return nil
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
