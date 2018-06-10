package main

import (
	"log"
	"os"
	"net/http"
	"github.com/gorilla/mux"
	"path/filepath"
	"github.com/tokkenno/my-web/server/pages/repositories"
)

func main() {
	port := os.Getenv("HTTP_PORT")

	if len(port) == 0 {
		port = "8080"
	}

	router := mux.NewRouter().StrictSlash(true)

	repositories.SetRoutes(router.PathPrefix("/repos").Subrouter())

	staticPath := os.Getenv("STATIC_PATH")
	if len(staticPath) == 0 {
		staticPath = "static"
	}

	staticPath, err := filepath.Abs(staticPath)
	if err != nil || len(staticPath) == 0 {
		log.Print("The static path can't be located")
	} else {
		log.Print("Static path: " + staticPath)
		router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(staticPath))))
	}

	http.Handle("/", router)

	log.Print("Listening on " + port)
	log.Fatal(http.ListenAndServe(":" + port, router))
}