# Probate Frontend

This is the frontend application for the Probate Personal Applicants online service. The service provides a clear interface for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can apply for Probate online. The service provides functionality for both single and multiple applicant journeys.

The Frontend Application uses Orchestrator to route specific requests to the underlying services such as Business Service and Submit Service.


## Getting Started
### Prerequisites

- [Node.js](nodejs.org) >= 12.5.0
- [yarn](yarnpkg.com)

If on Windows 10 follow setup instructions here: https://tools.hmcts.net/confluence/pages/viewpage.action?pageId=1457316967

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

### Running the application

Run the application local server:
```
$ yarn start:ld
```

The application can be completed locally at [https://localhost:3000](https://localhost:3000), provided all services are running in the background as described in the next section.

### Running the other services using docker-compose

```
# first time only
npx @hmcts/probate-dev-env --create
npx @hmcts/probate-dev-env
```

### Running the other services manually

Alternatively, to run probate-frontend with the other services locally you will need to clone and run the following services:

- probate-back-office: `https://github.com/hmcts/probate-back-office` - Follow the instructions in `probate-back-office/compose/README.md`.
- probate-orchestrator-service: `https://github.com/hmcts/probate-orchestrator-service` - Follow the instructions in `probate-orchestrator-service/README.md`
- probate-submit-service: `https://github.com/hmcts/probate-submit-service` - Follow the instructions in `probate-submit-service/README.md`


## Developing

Git hooks:

We have git hooks that enforce rules for commit messages.

These can be activated by running the following commands:
```
$ ln -s ../../pre-commit.sh .git/hooks/pre-commit
$ ln -s ../../commit-msg.sh .git/hooks/commit-msg
```

### Code style

Before submitting a Pull Request you will be required to run `$ yarn eslint` (which is also run automatically when trying to commit anyway).

We have a number of rules relating to code style that can be found in [.eslintrc.js](https://github.com/hmcts/probate-frontend/blob/develop/.eslintrc.js).

### Config

y config, rename the `config/dev_template.yaml` file to `config/dev.yaml`. Running the app with the node environment set to `dev` will ensure this file is used.
This file is not version controlled so any config here will not be pushed to git.

As an example, if you want to use LanuchDarkly locally, place the SDK Key in this file. You can keep the key there as this file is not version controlled.

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

For e2e tests (non launch darkly):
`$ yarn test-e2e`

For e2e tests (launch darkly):
`$ yarn test-e2e`


For contact tests:
`$ ADDRESS_TOKEN=xyz yarn test-contract`

You'll need to get the ADDRESS_TOKEN from the AAT vault `postcode-service-token2`

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hmcts/probate-frontend/blob/develop/LICENSE.md) file for details
