package repositories

import (
	"github.com/gorilla/mux"
	"net/http"
	"encoding/json"
)

func SetRoutes(router *mux.Router) {
	router.PathPrefix("/").Methods("GET").HandlerFunc(getRepos)
}

func getRepos(w http.ResponseWriter, r *http.Request) {
	var errors []string

	repositories, err := getGithubRepos()
	if err != nil { errors = append(errors, err.Error()) }

	responseData, err := json.Marshal(repositoryResponse{
		Repositories: repositories,
		Errors: errors,
	})

	if err != nil {
		http.Error(w, "Format error", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "max-age=300")
	w.Write(responseData)
}