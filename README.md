### A simple API to store triggers as named boolean values with MongoDB

- `POST https://triggers.netlify.app/.netlify/functions/triggers`
  - send an optional name with `{"name": "the-big-red-button"}`
  - the response will contain the teigger's ID, name and a password that you need to send to delete the trigger, and a JSON field 'active' that stores the boolean value.

- `GET https://triggers.netlify.app/.netlify/functions/triggers` gets all triggers
- `GET https://triggers.netlify.app/.netlify/functions/<trigger-name-or-id>` gets the trigger with the specified name or ID
- `POST https://triggers.netlify.app/.netlify/functions/<trigger-name-or-id>` sets the trigger
- `PUT https://triggers.netlify.app/.netlify/functions/<trigger-name-or-id>` unsets the trigger

- `DELETE https://triggers.netlify.app/.netlify/functions/<trigger-name-or-id>` deletes the trigger from the database
  - requires the password in the request body `{"password": "<very-secret>"}`
