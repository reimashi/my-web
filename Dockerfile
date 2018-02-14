FROM google/dart

ENV HTTP_PORT 80
ENV HTTPS_PORT 443

WORKDIR /app

ADD pubspec.* /app/
RUN pub get
ADD . /app
RUN pub get --offline

CMD []
ENTRYPOINT ["/usr/bin/dart", "bin/server.dart"]