## Chrome API

An API wrapper for puppeteer to generate PDF documents and screenshots from URL's and HTML content

### Environment variables

| Variable          | Description                       |
| ----------------- | :-------------------------------- |
| DATABASE_NAME     | Sets the MySQL database name      |
| DATABASE_USER     | Sets the MySQL database username  |
| DATABASE_PASSWORD | Sets the MySQL database passoword |
| DATABASE_HOST     | Sets the MySQL database host      |
| DATABASE_PORT     | Sets the MySQL database port      |
| RABBITMQ_USER     | Sets the rabbitmq username        |
| RABBITMQ_PASS     | Sets the rabbitmq password        |
| RABBITMQ_PORT     | Sets the rabbitmq port            |
| RABBITMQ_HOST     | Sets the rabbitmq hostname        |

### Database migrations

Uses the [Sequilize ORM](https://sequelize.org)

Run database migrations with
`npx sequelize-cli db:migrate`

### API endpoints

#### /screenshot

Takes a screenshot from a webpage or HTML content

input parmeters:

| Variable | Description                                   |
| -------- | :-------------------------------------------- |
| width    | The width of the screenshot, defaults to 1920 |
| height   | The width of the screenshot, defaults to 1080 |
| output   | Output file type, png or jpg                  |
| url      | The url of the webpage                        |
| html     | The HTML content capture a screenshot of      |

returns:
| Variable | Description |
| -------- | :-------------------------------------------- |
| success | The outcome of the call |
| jobId | The id of the job in the task queue |
| message | The error message if the operation was not successfull |

#### /pdf

Creates a PDF document from a webpage or HTML content

input parmeters:

| Variable | Description                                   |
| -------- | :-------------------------------------------- |
| width    | The width of the screenshot, defaults to 1920 |
| height   | The width of the screenshot, defaults to 1080 |
| url      | The url of the webpage                        |
| html     | The HTML content capture a screenshot of      |

returns:
| Variable | Description |
| -------- | :-------------------------------------------- |
| success | The outcome of the call |
| jobId | The id of the job in the task queue |
| filename | The filename of the created screenshot, can be accessed with {endpoint}/{filename} |
| message | The error message if the operation was not successfull |

### /job/{id}

Returns the status of a job in the task queue

returns:
| Variable | Description |
| -------- | :-------------------------------------------- |
| id | the task id |
| complete | returns the comppletion status of the job |
| success | if the task was processed successfully or not |
| filename | The output filename, can be accessed with {endpoint}/{filename} |
| message | The error message if the operation was not successfull |
| parameters | The input prameters for the task |
| createdAt | Timestamp of when the job was created |
| updatedAt | Timestamp of when the job was updated |

### Authentication

Every API call needs to have an the "Authorization" HTTP header set with an api key, e.g.

Authorization: {api key}
