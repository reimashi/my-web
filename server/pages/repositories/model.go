package repositories

import "time"

type repositoryUrl struct {
	Type string
	Url string
}

type repository struct {
	Name string
	Description string
	Urls map[string]string
	Updated time.Time
	Host string
	Language string
}

type repositoryResponse struct {
	Errors []string
	Repositories []repository
}