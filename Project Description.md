# Segment-Amplitude Integration



## Project Description

The main objective of this project is to process event data from a user's project and send the data to Amplitude using Amplitude's HTTP API



## Project Scope

This project focuses on parsing the event data, converting it into a format as detailed in Amplitude HTTP API documentation [https://amplitude.zendesk.com/hc/en-us/articles/204771828-HTTP-API] (https://amplitude.zendesk.com/hc/en-us/articles/204771828-HTTP-API) and sending it to Amplitude.

It does not explore other ways of sending event data to Amplitude and assumes the presence of a valid API key used to communicate with Amplitude. The scope of this project also doesn't provide error-handling for error code 429 (too_many_requests_for_device) but it does provide error-handling for errors with code 503 (server_error).



## Project Structure

A brief description of the core directories in this project:

  * `integration`: contains module `integration-builder` that returns the specific integration object based on the route and module `amplitude-integration` that handles the integration with Amplitude.

  * `routes`: directory containing the API routes. 

  * `test`: contains test cases for this project. Details for running the tests can be found in the Project README file.



## How it works 

To send an event to Amplitude, pass the event (JSON) as part of the body of a POST request to the endpoint (https://segment-integrations.herokuapp.com/v1/amplitude). 

 * When POST request hits the endpoint, a call is made to `integration-builder`.

 * Based on the route, the `integration-builder` creates an instance of the specific integration object; in this case `amplitude-integration`

 * The newly created instance of `amplitude-integration` worker has access to Amplitude's endpoint from the global `amplitude-integration` object. The workerr parses the event, representing it in the required format as defined in Amplitude's HTTP API documentation. It also maintains a `count` attribute which it uses for error-handling.

 * The `amplitude-integration` worker then sends the processed event using the global `amplitude-integration`'s sendEvent function and the user's api key (obtained from the production environment variables or hard-coded, if running locally) to Amplitude's HTTP API endpoint. When the response is received from Amplitude, a response object (JSON) is sent to the client except when an Error 503 occurs.



## Error Handling 

The `amplitude-integration` object has a dictionary of error response codes and messages codes where the keys are the exact error messages from Amplitude's HTTP API calls. These codes (which aren't exhaustive) include:
 
 "missing argument api_key": {
    "status": 403,
    "message": "No Amplitude API Key provided"
  },
  "invalid api_key": {
    "status": 403,
    "message": "Invalid Amplitude API Key"
  },
  "missing argument event": {
    "status": 400,
    "message": "No Event Params provided"
  },
  "invalid event json": {
    "status": 400,
    "message": "Invalid Event Format"
  }

  Other error types are sent exactly the same way as received from Amplitude's HTTP API. For the above error codes sent back to the client, the `message/event id` for the failed event is also included.

 * For handling error with status code 503, the worker instance of `amplitude-integration` tries to resend the event 10 times at 3 seconds interval. If failure persists after the tenth time, it sends an error object to the client with status 500, the event ID and error message: 'Error registering event'. 
