# Segment-Amplitude Integration




## Project Description

Refer to [Project Description] (https://facebook.github.io/react/) for a detailed description of the scope of this project.




## Project Dependencies

All project dependencies are in `package.json` file




## Running the Application

To run and test it locally, run following command after you clone the repo:

```
### Step I: Install dependencies
bower install & npm install

### Step II: Start up application server
npm start

### Step III: Running the tests
npm test

```



## Technology Stack

  * Back-End: [Express] (https://expressjs.com) v4.13.4, [Node js] (https://nodejs.org/en) v4.13.1
  * Testing: Chai [http://passportjs.org] (http://passportjs.org), Mocha [http://passportjs.org] (http://passportjs.org)
  * Build Tool: Webpack [https://webpack.github.io] (https://webpack.github.io)




## Development: Extending the Application

To add implementation for integration with other partners, after an accepted Git Pull request, you need to create the following modules:

### Router
  * Define integration endpoint: `/v1/{NAME_OF_PARTNER}`. For example, to integrate with Marketo, the endpoint would be: `/v1/marketo`
  * Include endpoint in `/routes/index.js`
  * (Optional) Create test for new endpoint in : `/tests/index.js`

### Integration
  * Create `/integration/{NAME_OF_PARTNER}-integration.js` module that would contain all the specific integration details for partner.
  * Modify `/integration/integration-builder.js` to include integration object for new partner.
  * (Optional) Create test for new integration module in `/tests/{NAME_OF_PARTNER}-integration.js`





## Deployment:

This project is currently hosted on [Heroku] (https://www.heroku.com) and the API endpoint is [https://segment-integrations.herokuapp.com] (https://segment-integrations.herokuapp.com) 

The endpoint for all partner-integrations has a similar endpoint of the form `https://segment-integrations.herokuapp.com/v1/{NAME_OF_PARTNER}`. 
For example, the Amplitude API endpoint is `https://segment-integrations.herokuapp.com/v1/amplitude`

To deploy on Heroku, use command `git push heroku master`

