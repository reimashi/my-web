FROM golang:latest

RUN apt-get update && \
    apt-get install git

RUN export CGO_ENABLED=0 && \
    export GOOS=linux

WORKDIR /go/src/app
COPY ./server .

RUN go get -d -v ./...

RUN mkdir -p /build && \
    go build -a -installsuffix cgo -o /build/server .

RUN chmod +x /build/server

FROM scratch
WORKDIR /app
COPY --from=0 /build/server .

ENTRYPOINT ['/app/server']