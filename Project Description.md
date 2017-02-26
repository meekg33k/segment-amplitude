# Segment-Amplitude Integration



## Project Description

The main objective of this project is to process event data from a user's project and send the data to Amplitude using Amplitude's HTTP API



## Project Scope

This project focuses on parsing the event data, converting it into a format as detailed in Amplitude HTTP API documentation [https://amplitude.zendesk.com/hc/en-us/articles/204771828-HTTP-API] (https://amplitude.zendesk.com/hc/en-us/articles/204771828-HTTP-API) and sending it to Amplitude.

It does not explore other ways of sending event data to Amplitude and assumes the presence of a valid API key used to communicate with Amplitude. The scope of this project also doesn't provide error-handling for error code 429 (too_many_requests_for_device) but it does provide error-handling for error code 503 (server_error).



## Project Structure

A brief description of the core directories in this project:

  * `integration`: contains module `integration-builder` that returns the specific integration object based on the route and module `amplitude-integration` that handles the integration with Amplitude.

  * `routes`: directory containing the API routes. 

  * `tests`: contains all the unit tests for this project.



## How it works 

To send an event to Amplitude, pass the event as part of the body of a POST request to the endpoint (https://segment-integrations.herokuapp.com/v1/amplitude). 

 * POST request hits the endpoint, a call is made to `integration-builder`

 * Based on the route, the `integration-builder` creates the specific integration object; in this case `amplitude-integration`

 * The `amplitude-integration` object which has Amplitude's endpoint and the APIKEY, parses the event, transforming it in to the required format as defined in the Amplitude HTTP API documentation.

 * The `amplitude-integration` object then emits the processed event to Amplitude's HTTP API endpoint and based on the response, it sends the status to the client.



## Error Handling 

The `amplitude-integration` object has a dictionary of error response codes and messages codes (based on Amplitude's error responses). These codes are:
 
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

  For all error responses sent back to the client, the `message/event id` for the failed event is also included.

 * For handling error with status code 503, `amplitude-integration` tries to resend the event for 10 times at 3 seconds interval, and if failure persists after the tenth time, it sends an error with status code 500 with the event ID and error message: 'Error registering event'. 
