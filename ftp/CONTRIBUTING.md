# NextCache FTP Server

---------------------------------------------

For those wishing to contribute to this section, please read the server design carefully before making a PR.

The server side script has to be written in node.js
The server port and ip have to be saved in a variable to allow easy modifications

The server is expected to have an HTTP endpoint that listens for database operation calls.

---------------------------------------------

### Insert

- Receive the object details from the request.
- Receive the file.
- Save the file at the specified loaction inside the storage directory
- Return a 'UPLOAD_SUCCESSFUL' response if the insertion is successful, or a 'UPLOAD_FAILED' response if the insertion failed.

### Delete
- Receive the query from the request.
- Receive the address for the file to be deleted from the request
- Delete the concerned file, and return 'DELETE_SUCCESSFUL' if successful, or 'DELETE_FAILED' if failed

### Query
- Receive the query or the address from the request
- Search for the concerned files in the storage
- Sort or modify the files as per the specs in the request
- Return the file addresses in the response if found after a 'QUERY_SUCCESSFUL' or 'QUERY_FAILED' if no files are found

### Download
- Receive the query or the address from the request
- Search for the concerned file in the storage
- Return the download link to the file if found after a 'DOWNLOAD_SUCCESSFUL' or 'DOWNLOAD_FAILED' if the file is not present

### Count
- Receive the address of the file
- Search for the concerned collection or document in the database
- Return the count of files in location along with a 'COUNT_SUCCESSFUL' response or a 'COUNT_FAILED' response if the counting fails
