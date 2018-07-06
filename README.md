# Probate Frontend

This is the frontend application for the Probate Personal Applicants online service. The service provides a clear interface for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can apply for Probate online. The service provides functionality for both single and multiple applicant journeys.

The Frontend Application delegates a number of backend logic to the underlying services, including Persistence, Business and Submit services.

## Getting Started
### Prerequisites

- [Node.js](nodejs.org) >= 8.9.0
- [yarn](yarnpkg.com)

### Installation

Install dependencies by executing the following command:

```
$ yarn install
```

Sass:

```
$ yarn setup
```

Git hooks:

We have git hooks that enforce rules for commit messages.

These can be activated by running the following commands:
```
$ ln -s ../../pre-commit.sh .git/hooks/pre-commit
```

```
$ ln -s ../../commit-msg.sh .git/hooks/commit-msg
```

### Running the application

Run the application local server:

```
$ yarn start
```

By navigating to [https://localhost:3000](https://localhost:3000) you can partially complete an application locally.

To complete an end to end journey on the application locally without building the other services, you can run the following command which utilises stubs to mimic certain actions carried out during an end to end journey:

`$ yarn start & yarn submit-stub & yarn persistence-stub & yarn business-stub & yarn payment-stub & yarn find-address-stub`

As before, the application can be completed locally at [https://localhost:3000](https://localhost:3000).

### Running the application in Docker

Once you `cd ..` out of the repository you can run the following command:
```
$ docker build -t frontend-app .
```
This command will build the Frontend Docker image using the *Dockerfile*.

To run the Docker container:
```
$ docker run -p 3000:3000 frontend-app
```

## Developing
### Code style

Before submitting a Pull Request you will be required to run:
`$ yarn eslint`

We have a number of rules relating to code style that can be found in [.eslintrc.js](https://github.com/hmcts/probate-frontend/blob/develop/.eslintrc.js).

### Running the tests

Mocha is used for writing tests.

The test suite can be run with:
`$ yarn test`

For unit tests:
`$ yarn test-unit`

For component tests:
`$ yarn test-component`

For accessibility tests:
`$ yarn test-accessibility`

For test coverage:
`$ yarn test-coverage`

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hmcts/probate-frontend/blob/develop/LICENSE.md) file for details
