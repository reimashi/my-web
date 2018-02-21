# Build server
FROM golang:1.9.4 as server-builder

RUN apt-get update && \
    apt-get install git

WORKDIR /go/src/app
COPY ./server .

RUN go get -d -v ./...

RUN mkdir -p /build && \
    CGO_ENABLED=0 GOOS=linux go build -ldflags "-extldflags -static" -installsuffix cgo -a -o /build/server .

RUN chmod +x /build/server

# Build client
FROM node:latest as client-builder

RUN apt-get update && \
    apt-get install apt-transport-https rsync -y

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install --no-install-recommends yarn -y

RUN yarn global add webpack less

WORKDIR /app
COPY ./client .

RUN yarn

RUN mkdir -p /dist

RUN rsync -av --include='*.html' --include='*.jpg' --include='*.jpeg' --include='*.png' --include='*.gif' --include='*.ico' --include='*.md' -f 'hide,! */' ./app/ /dist
RUN webpack --env.BuildDir=/dist --config webpack.config.build.js
RUN lessc /app/app/styles/main.less /dist/styles/main.css

RUN find /dist

# Deploy runtime
FROM alpine

WORKDIR /static
COPY --from=client-builder /dist .

WORKDIR /
COPY --from=server-builder /build .

ENTRYPOINT /server