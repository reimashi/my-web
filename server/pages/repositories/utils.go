package repositories

import (
	"os"
	"golang.org/x/oauth2"
	"github.com/google/go-github/github"
	"strings"
	"golang.org/x/net/context"
	"log"
	"errors"
)

func getGithubRepos() ([]repository, error) {
	token := os.Getenv("GITHUB_TOKEN")

	if len(token) == 0 {
		log.Print("The github token is not setted on environment variables")
		return []repository{}, errors.New("github is not configured")
	}

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	tc := oauth2.NewClient(ctx, ts)

	client := github.NewClient(tc)

	options := new(github.RepositoryListOptions)
	options.Visibility = "all"
	options.PerPage = 200

	orgs, _, err := client.Repositories.List(ctx, "reimashi", options)

	if err != nil {
		log.Print("The request to github API has failed")
		return []repository{}, errors.New("github query error")
	}

	var responseList []repository
	for _, org := range orgs {
		baseUrl := strings.Replace(org.GetURL(), "api.github.com/repos/", "github.com/", -1)
		repoInfo := repository{
			Name: org.GetName(),
			Description: org.GetDescription(),
			Updated: org.GetUpdatedAt().UTC(),
			Language: org.GetLanguage(),
			Urls: map[string]string{
				"main": baseUrl,
			},
			Host: "Github",
		}

		if org.GetHasWiki() {
			repoInfo.Urls["wiki"] = baseUrl + "/wiki"
		}

		if org.GetHasIssues() {
			repoInfo.Urls["issues"] = baseUrl + "/issues"
		}

		responseList = append(responseList, repoInfo);
	}

	return responseList, nil
}