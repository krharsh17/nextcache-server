# NextCache Ml engine

---------------------------------------------

For those wishing to contribute to this section, please read the server design carefully before making a PR.

The server side script has to be written in node.js
The server port and ip have to be saved in a variable to allow easy modifications

The server is expected to have an HTTP endpoint that listens for ml model access

---------------------------------------------

### Evaluate

- Receive the model name and the input file location from the request.
- Run the concerned model with the specified data file. If the file does not exist, return a 'NO_INPUT' response.
- If any error occurs, send a 'EVAL_FAILED' response
- If the evaluation is successful, write the results in a file, save the file in the storage stash and return the location of the file in the reponse with 'EVAL_SUCCESSFUL'.