# Probate Frontend
This is the frontend application for the Probate Personal Applicants online service. The service provides a clear interface for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can apply for Probate online. The service provides functionality for both single and multiple applicant journeys.

The Frontend Application delegates a number of backend logic to the underlying services, including Persistence, Business and Submit services.

## Getting Started
### Prerequisites
- [Node.js](nodejs.org) >= 8.9.0
- [yarn](yarnpkg.com)
- [npm](npmjs.com)

### Running the application
Install dependencies by executing the following command:  

`$ yarn install && npm install`

Sass:  

`$ npm run setup`

Run the application local server:  

`$ npm start`

By navigating to [https://localhost:3000](https://localhost:3000) you can partially complete an application locally.

To complete an end to end journey on the application locally without building the other services, you can run the following command which utilises stubs to mimic certain actions carried out during an end to end journey:  

`$ npm start & npm run submit-stub & npm run persistence-stub & npm run business-stub & npm run payment-stub`

As before, the application can be completed locally at [https://localhost:3000](https://localhost:3000).


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
