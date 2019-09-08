# NextCache Database Server

---------------------------------------------

For those wishing to contribute to this section, please read the server design carefully before making a PR.
The database to be used is Mongo-db
The server side script has to be written in node.js
The server port and ip have to be saved in a variable to allow easy modifications

The server is expected to have an HTTP endpoint that listens for database operation calls.

---------------------------------------------

### Insert

- Receive the object details from the request.
- Wrap the object data into a JS Object.
- Push the object in the database at the request's specified location
- Return a 'INSERT_SUCCESSFUL' response if the insertion is successful, or a 'INSERT_FAILED' response if the insertion failed.

### Delete
- Receive the query from the request.
- Receive the address for the document or collection to be deleted from the request
- Delete the concerned document, and return 'DELETE_SUCCESSFUL' if successful, or 'DELETE_FAILED' if failed

