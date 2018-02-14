import 'dart:io';

import 'package:args/args.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:crossroad/crossroad.dart';
import 'package:shelf_static/shelf_static.dart';
import 'shelf_cors.dart';

import 'github_controller.dart';
import 'markdown_controller.dart';

void main(List<String> args) {
  var parser = new ArgParser()
    ..addOption('port', abbr: 'p', defaultsTo: '8081');

  var result = parser.parse(args);

  var port = int.parse(result['port'], onError: (val) {
    stdout.writeln('Could not parse port value "$val" into a number.');
    exit(1);
  });

  //Crossroad.addMiddleware(corsMiddleware());

  new GithubController(Crossroad.route("/github"));
  new MarkdownController(Crossroad.route("/docs"));
  Crossroad.getS("/.*",
      createStaticHandler('client/app', defaultDocument: 'index.html'));

  io.serve(Crossroad.handler, '0.0.0.0', port).then((server) {
    print('Serving at http://${server.address.host}:${server.port}');
  });
}