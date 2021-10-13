FROM golang:1.17

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go mod download

RUN go get -u github.com/cosmtrek/air


COPY *.go ./

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]