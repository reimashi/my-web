import 'dart:async';
import 'dart:convert';
import 'package:crossroad/crossroad.dart';
import 'package:github/server.dart';

const GITHUB_API = "7655dfe6405ab028a3a33773c761f376989e2bc3";

class GithubController {
  final Router router;

  GithubController(Router r) : this.router = r {
    this.router.get("/", getRepos);
  }

  static Future<Response> getRepos(
      Request req, Map<String, Object> params) async {
    var github =
        createGitHubClient(auth: new Authentication.withToken(GITHUB_API));
    Map<String, Map> myrepos = {};

    await for (Repository repo in github.repositories
        .listUserRepositories("reimashi", sort: "pushed", direction: "desc")) {
      Map repoInfo = {
        "name": repo.name,
        "description": repo.description,
        "updated": repo.pushedAt.toIso8601String(),
        "url": repo.htmlUrl
      };

      if (repo.hasWiki) repoInfo["url_wiki"] = repo.htmlUrl + "/wiki";
      if (repo.hasIssues) repoInfo["url_bug"] = repo.htmlUrl + "/issues";

      myrepos[repo.name] = repoInfo;
    }

    return new Response.ok(JSON.encode(myrepos),
        headers: {"Content-Type": "application/json"});
  }
}
