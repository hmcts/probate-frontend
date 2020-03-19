# Probate Frontend

This is the frontend application for the Probate Personal Applicants online service. The service provides a clear interface for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can apply for Probate online. The service provides functionality for both single and multiple applicant journeys.

The Frontend Application delegates a number of backend logic to the underlying services, including Persistence, Business and Submit services.


## Getting Started
### Prerequisites

- [Node.js](nodejs.org) >= 12.5.0
- [yarn](yarnpkg.com)

### Installation

Install dependencies by executing the following command:
```
$ yarn install
```

Compile SASS stylesheets by running the following command:
```
$ yarn setup
```

Build a `git.properties.json` by running the following command:
```
$ yarn git-info
```

Git hooks:

We have git hooks that enforce rules for commit messages.

These can be activated by running the following commands:
```
$ ln -s ../../pre-commit.sh .git/hooks/pre-commit
$ ln -s ../../commit-msg.sh .git/hooks/commit-msg
```

### Running the application

Run the application local server:
```
$ yarn start
```

The application will be available locally at [https://localhost:3000](https://localhost:3000) but you will need to clone and have the following repositories up and running in the background:

- probate-back-office: `https://github.com/hmcts/probate-back-office` - Follow the instructions in `probate-back-office/compose/README.md`.
- probate-orchestrator-service: `https://github.com/hmcts/probate-orchestrator-service` - Follow the instructions in `probate-orchestrator-service/README.md`
- probate-submit-service: `https://github.com/hmcts/probate-submit-service` - Follow the instructions in `probate-submit-service/README.md`

## Developing
### Code style

Before submitting a Pull Request you will be required to run `$ yarn eslint` (which is also run automatically when trying to commit anyway).

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
`$ yarn test:coverage`

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hmcts/probate-frontend/blob/develop/LICENSE.md) file for details
