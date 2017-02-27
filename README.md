# Segment-Amplitude Integration




## Project Description

Refer to [Project Description] (https://github.com/uduakeren/segment-amplitude/blob/master/Project%20Description.md) for a detailed description of the project.




## Project Dependencies

All project dependencies are in `package.json` file





## Technology Stack

  * Back-End: [Express] (https://expressjs.com) v4.13.4, [Node js] (https://nodejs.org/en) v4.13.1
  * Testing:  [Chai] (https://www.npmjs.com/package/chai), [Chai-Http] (https://github.com/chaijs/chai-http), [Mocha] (https://mochajs.org/)





## Running the Application

To run and test it locally, you need to create a free account with [Amplitude] (https://amplitude.com/signup). Create a test project so that you can obtain an API key. You may also need to obtain some sample event data from [Segment] (https://segment.com/docs/integrations/amplitude/). 

Once you have cloned the project, the following are the steps to run the application: 

```
### Step I: Install dependencies
npm install

### Step II: Start up application server
npm start

### Step III: Update amplitude-integration module with your api key

### Step IV: Run the tests
npm test

```




## Development: Extending the Application

To add implementation for integration with other partners, after an accepted Git Pull request, you need to create the following modules:

### Router
  * Define integration endpoint: `/v1/{NAME_OF_PARTNER}`. For example, to integrate with Marketo, the endpoint would be: `/v1/marketo`
  * Include endpoint in `/routes/index.js`
  * (Optional) Add test case for new endpoint in : `/tests/index.js`

### Integration
  * Create `/integration/{NAME_OF_PARTNER}-integration.js` module that would contain all the specific integration details for partner.
  * Modify `/integration/integration-builder.js` to include integration object for new partner.
  * (Optional) Create test for new integration module in `/tests/{NAME_OF_PARTNER}-integration.js`





## Deployment:

This project is currently hosted on [Heroku] (https://www.heroku.com) and the API endpoint is [https://segment-integrations.herokuapp.com] (https://segment-integrations.herokuapp.com) 

The endpoint for all partner-integrations are of the form `https://segment-integrations.herokuapp.com/v1/{NAME_OF_PARTNER}`. For example, the Amplitude API endpoint is `https://segment-integrations.herokuapp.com/v1/amplitude`

To deploy on Heroku, use command `git push heroku master`

