# brienne

A scraper to check criteria about the accessibility of websites.

## Install

Prerequisites:

- node.js 12+
- yarn 1.22+

```
yarn set version berry
yarn install
```

## Run the project

```
yarn node ./src
```

To output the results to the console instead of ElasticSearch (for testing purpose, for example), use the BRIENNE_OUTPUT environment variable:

```
BRIENNE_OUTPUT=console yarn node ./src
```

## Environment

| Name                  | Default                               | Description                                                                                                                                                     |
|-----------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BRIENNE_LOGGER_LEVEL  | info                                  | The level of the logger.                                                                                                                                        |
| BRIENNE_INPUT_FILE    | example/default.json                  | The file to process. It's a JSON array file listing the websites to analyze.                                                                                    |
| BRIENNE_OUTPUT        | elastic                               | The output where the results are published. Can be one of "elastic", "console", or "blackhole".                                                                 |
| BRIENNE_ES_URL        | http://elastic:elastic@localhost:9200 | The URL of the ElasticSearch instance. By default, authenticate with the elastic/elastic credentials.                                                           |
| BRIENNE_ES_INDEX_NAME | brienne                               | The name of the index used to publish the results.                                                                                                              |
| BRIENNE_RUNNER        | local                                 | The runner to use. "local" is a development runner running the scripts with a single worker. "docker" is a runner running several workers in Docker containers. |
| BRIENNE_WORKERS       | 4                                     | The number of parallel workers. The websites to process are divided between them.                                                                               |
| BRIENNE_PAGE_TIMEOUT  | 10000                                 | The timeout in ms when a page is unreachable.                                                                                                                   |
| BRIENNE_CACHE_FOLDER  | cache                                 | The folder where the HTML content is cached.                                                                                                                    |

## Build the Docker image

```
docker build -t datarmination/brienne .
```

## Run a Docker container locally

Run ElasticSearch & Kibana:

```
cd docker/elasticsearch
docker-compose up
```

Use the docker/brienne project to create and run a container easily. First, modify docker-compose.yml: the "source" property of the volume should be the absolute path of the folder containing "websites.json". Then, run:

```
cd docker/brienne
docker-compose up
```


Check that the index "brienne" has been created with some documents on [Kibana](http://localhost:5601/).