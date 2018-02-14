import 'dart:async';
import 'dart:io';
import 'package:markdown/markdown.dart';
import 'package:crossroad/crossroad.dart';

class MarkdownController {
  final Router router;
  final Directory docDir;

  MarkdownController(Router r)
      : this.router = r,
        this.docDir = new Directory("./markdown") {
    this.router.get("/:document", getDocument);
    if (!this.docDir.existsSync())
      throw new Exception("The /markdown directory dont exists");
  }

  Future<Response> getDocument(Request req, Map<String, Object> params) async {
    File docFile = new File(this.docDir.path + "/" + params["document"]);

    if (await docFile.exists()) {
      return new Response.ok(
          markdownToHtml(await docFile.readAsString(),
              inlineSyntaxes: [new InlineHtmlSyntax()]),
          headers: {"Content-Type": "text/html"});
    } else {
      return new Response.notFound("Document not found: ${params["document"]}");
    }
  }
}
