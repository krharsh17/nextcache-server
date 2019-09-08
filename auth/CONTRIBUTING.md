# NextCache Authentication Server

---------------------------------------------

For those wishing to contribute to this section, please read the server design carefully before making a PR.
The database to be used is Mongo-db
The server side script has to be written in node.js
The server port and ip have to be saved in a variable to allow easy modifications

The server is expected to have an HTTP endpoint that listens for user sign-in and sign-up.

---------------------------------------------

## Sign in

---------------------------------------------

- Sign in
    - Receive the username and password-hash from the request
    - Search the auth database for the user with the received username
    - Retrieve its details, and compare the received password-hash with the hash in the database
    - If the hashes match, look for the ```login_state``` variable in the user's record
        - If the state is true, send a 'USER_ALREADY_LOGGED_IN' response
        - If the state is false, check for the ```user_blocked``` variable, and if it is false, set state to true, reset the ```login_attempts``` variable to zero, and send a 'LOGIN_SUCCESSFUL' response along with the user login token that has to be generated and saved afresh in every new login session. If the blocked variable is true, send a 'USER_BLOCKED' response.
    - If the password-hashes do not match, increment the ```login_attempts``` variable, and if it reaches a particular number, defined as MAX_LOGIN_ATTEMPTS, set the ```user_blocked``` variable to true. Also, start a timer that resets the ```user_blocked``` variable to false after a set number of milliseconds specified in COOLDOWN_TIME and send a 'INVALID_AUTH_CRED` response.

- Sign out
    - Receive the user login token
    - Search the auth database for the user with the specified login token.
    - If no user is found, send a 'NON-EXISTENT_USER' response.
    - If a user is found, change its ```login_state``` to false, set its ```login_token``` to null and send a 'LOGOUT _SUCCESSFUL' response. 

--------------------------------------------

## Sign up

---------------------------------------------

- Receive the user details from the request
- Search the auth database for the received email address and if any record matches, return a 'EMAIL_ALEADY_IN_USE' response.
- If no record matches
    - Create a user object using the data received
    - Attach
        - ```login_state```: true
        - ```login_attempts```: 0
        - ```user_blocked```: false
        - ```login_token```: <Generate a login token and insert here>
        - ```user_id```: <Generate and insert a unique ID for the user>
        to the user object.
    - Push the user object in the auth database
    - If the push is successful, send a 'SIGNUP_SUCCESSFUL' reponse attached with the login_token.
    - If the push is unsuccessful, send a 'SIGNUP_FAILED' response and log the error in the console.
