FROM golang:1.24-alpine AS builder

WORKDIR /revline

COPY . ./

RUN apk update && \
  apk upgrade -U && \
  apk add build-base libwebp-dev

RUN go mod download

RUN CGO_ENABLED=1 go build -o revline .

FROM alpine:latest

WORKDIR /revline

RUN apk update && \
  apk upgrade -U && \
  apk add --no-cache ca-certificates libwebp-dev curl

RUN curl -sSf https://atlasgo.sh | sh

COPY ./ent/migrate/migrations/ ./ent/migrate/migrations/

COPY --from=builder /revline/revline .

ENV PORT=4000
ENV HOST=0.0.0.0
ENV ENVIRONMENT=production

EXPOSE 4000

CMD [ "./revline" ]
