group "default" {
  targets = ["api", "web"]
}

target "api" {
  context = "."
  dockerfile = "./docker/api.dockerfile"
  tags = ["line/abc-user-feedback-api:latest"]
  platforms = ["linux/amd64", "linux/arm64/v8"]
  cache-from = ["type=gha"]
  cache-to = ["type=gha,mode=max"]
}

target "web" {
  context = "."
  dockerfile = "./docker/web.dockerfile"
  tags = ["line/abc-user-feedback-web:latest"]
  platforms = ["linux/amd64", "linux/arm64/v8"]
  cache-from = ["type=gha"]
  cache-to = ["type=gha,mode=max"]
}