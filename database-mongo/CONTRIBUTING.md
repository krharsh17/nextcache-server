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

sample cmd request: ```curl http://localhost:8081 -d "login_token D <Document/Collection reference>"```

- Receive the query from the request.
- Receive the address for the document or collection to be deleted from the request
- Delete the concerned document, and return 'DELETE_SUCCESSFUL' if successful, or 'DELETE_FAILED' if failed

### Update

- Receive the query from the request.
- Receive the address for the document or collection to be updated from the request.
- Update the concerned document with the updated data from the request
- Return 'UPDATE_SUCCESSFUL' if successful, or 'UPDATE_FAILED' if failed

### Query

sample cmd request: ```curl http://localhost:8081 -d "login_token S Query"```

- Receive the query or the address from the request
- Search for the concerned collection or document in the database
- Sort or modify the results as per the specs in the request
- Return the data in the response if found after a 'QUERY_SUCCESSFUL' or 'QUERY_FAILED' if no documents are found

### Count

sample cmd request: ```http://localhost:8081 -d  "login_token C reference Query"```

- Receive the address of the collection or the document
- Search for the concerned collection or document in the database
- Return the count of elements in the document or documents in the collection along with a 'COUNT_SUCCESSFUL' response or a 'COUNT_FAILED' response if the counting fails

### Dummy Data

sample cmd request: ```http:localhost:8081 -d "DD <Reference> query1=datatype&query2=datatype 5"```

- Receive the query from the response for the address, number and type of fields to be created along with the number of sample documents to be created
- Create the relevant collection and respond with 'CREATION_SUCCESSFUL' if successful, or 'CREATION_FAILED' if failed

