package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/google/go-github/github"
	"context"
	"golang.org/x/oauth2"
	"os"
	"encoding/json"
	"time"
	"strings"
)

func getMyRepositories(w http.ResponseWriter, r *http.Request) {
	token := os.Getenv("GITHUB_TOKEN")

	if len(token) == 0 {
		http.Error(w,"Github token not setted on server", 500)
		return
	}

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	tc := oauth2.NewClient(ctx, ts)

	client := github.NewClient(tc)

	options := new(github.RepositoryListOptions)
	options.Visibility = "all"

	orgs, _, err := client.Repositories.List(ctx, "reimashi", options)

	if err != nil {
		http.Error(w, "Github api error", 500)
		return
	}

	var responseList []map[string]string
	for _, org := range orgs {
		baseUrl := strings.Replace(*org.URL, "api.github.com/repos/", "github.com/", -1)
		repoInfo := map[string]string{
			"name": *org.Name,
			"description": *org.Description,
			"updated": org.UpdatedAt.UTC().Format(time.RFC3339),
			"url": baseUrl,
		}

		if *org.HasWiki {
			repoInfo["url_wiki"] = baseUrl + "/wiki"
		}

		if *org.HasIssues {
			repoInfo["url_bug"] = baseUrl + "/issues"
		}

		responseList = append(responseList, repoInfo);
	}

	responseData, err := json.Marshal(responseList)

	if err != nil {
		http.Error(w, "Format error", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(responseData)
}

func main() {
	port := os.Getenv("HTTP_PORT")
	spath := os.Getenv("STATIC_PATH")

	if len(port) == 0 {
		port = "8080"
	}

	if len(spath) == 0 {
		spath = "static"
	}

	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/github", getMyRepositories)

	//fs := http.FileServer(http.Dir("static"))
	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(spath))))

	http.Handle("/", router)

	log.Print("Listening on " + port)
	log.Fatal(http.ListenAndServe(":" + port, router))
}