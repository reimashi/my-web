FROM scratch

ENV HTTP_PORT 80

ADD build/server /

ENTRYPOINT ["/server"]
