# Probate Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Probate&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Probate) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Probate&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Probate) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Probate&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Probate) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Probate&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Probate)

This is the frontend application for the Probate Personal Applicants online service. The service provides a clear interface for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can apply for Probate online. The service provides functionality for both single and multiple applicant journeys.

The Frontend Application uses Orchestrator to route specific requests to the underlying services such as Business Service and Submit Service.

## Overview

<p align="center">
<b><a href="https://github.com/hmcts/probate-frontend">probate-frontend</a></b> • <a href="https://github.com/hmcts/probate-caveats-frontend">probate-caveats-frontend</a> • <a href="https://github.com/hmcts/probate-back-office">probate-back-office</a> • <a href="https://github.com/hmcts/probate-orchestrator-service">probate-orchestrator-service</a> • <a href="https://github.com/hmcts/probate-business-service">probate-business-service</a> • <a href="https://github.com/hmcts/probate-submit-service">probate-submit-service</a> • <a href="https://github.com/hmcts/probate-persistence-service">probate-persistence-service</a>
</p>

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/probate/images/structurizr-probate-overview.png" width="800"/>
</p>

<details>
<summary>Citizen view</summary>
<img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/probate/images/structurizr-probate-citizen.png" width="700">
</details>
<details>
<summary>Caseworker view</summary>
<img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/probate/images/structurizr-probate-caseworker.png" width="700">
</details>


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

### Running the application (FE only / everything else AAT)

If you are only testing the FE and don't need to point to anything else locally, use the following:
```
$ yarn start:dev:ld:aat
```
This will run FE on localhost:3001 and point everything else to AAT. This means that you can use IDAM AAT logins and
create cases that will be visible on XUI AAT.

If you need to add more config or secrets, see dev-aat.yaml and app/setupSecrets.js, respectively.

### Running the application

Run the application local server as dev:
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

For development only config, rename the `config/dev_template.yaml` file to `config/dev.yaml`. Running the app with the node environment set to `dev` will ensure this file is used.
This file is not version controlled so any config here will not be pushed to git.

As an example, if you want to use LanuchDarkly locally, place the SDK Key in this file. You can keep the key there as this file is not version controlled.

If you want to allowed login you will need all the services running through manually/using docker-compose

set following in default.yml
```
  useIDAM: 'true'
  requireCcdCaseId: 'true'
```
you shoud then be able to use a citizen user of
```
testusername@test.com/Pa55word11
```
add a dev.yaml file to the /config folder with contents if you want to run LauchDarkly locally
```
featureToggles:
  launchDarklyKey: 'sdk-4d50eb6e-8400-4aa7-b4c5-8bdfc8b1d844'
```
emails can be monitored at:
```
http://localhost:8025
```

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

