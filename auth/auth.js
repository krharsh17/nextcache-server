var http = require('http');
var MongoClient = require('mongodb').MongoClient;

var port_number = 8081;
var ip_address = "127.0.0.1";

var RESPONSE_DUPLICATE = "EMAIL ALREADY IN USE";
var RESPONSE_SUCCESSFUL = "SUCCESSFUL";
var RESPONSE_FAILED = "FAILED";
var RESPONSE_INVALID_CRED = "INVALID CREDENTIALS";
var RESPONSE_LOGGED_IN = "LOG IN ";
var RESPONSE_LOGGED_OUT = "LOG OUT ";
var REPONSE_SIGNED_UP = "SIGN UP ";
var RESPONSE_ALREADY_LOGGED_IN = "USER ALREADY LOGGED IN";
var RESPONSE_ALREADY_LOGGED_OUT = "USER ALREADY LOGGED OUT";
var RESPONSE_BLOCKED = "USER BLOCKED";

var login_identifier = "LI";
var logout_identifier = "LO"
var signup_identifier = "SU";

var MAX_LOGIN_ATTEMPTS = 10;
var BLOCK_COOLDOWN = 24 * 60 * 60 * 1000;


var usersDB = "NextCacheAuth"
var usersDBurl = "mongodb://localhost:27017/" + usersDB;

console.log("Firing up NextCache Auth server...\n");

console.log("Auth server running at http://" + ip_address + ":" + port_number);
console.log("MongoDB running at " + usersDBurl);

console.log("\nLogin/SignUp request format: curl http://" + ip_address + ":" + port_number + " -d \"[" + login_identifier + "\\" + signup_identifier + "] [email] [password] [state_lock/username]\"");
console.log("\nLogout request format: curl http://" + ip_address + ":" + port_number + " -d \"[" + logout_identifier + "] [login_token]\"");


var authServer = http.createServer(function (request, response) {
    request.on('data', function (message) {
        if (message.split(" ")[0] == signup_identifier) {
            signUp(message);
        } else if (message.split(" ")[0] == login_identifier) {
            login(message);
        } else if (message.split(" ")[0] == logout_identifier) {
            logout(message);
        }
    });
});
authServer.listen(port_number, ip_address);


function signUp(message) {
    var messageString = message.toString().split(" ");
    var email = messageString[1];
    var password = messageString[2];
    var userName = messageString[3];

    MongoClient.connect(usersDBurl, function (err, client) {
        var db = client.db("next-cache");
        if (err) {
            throw err
        };

        var userID = "user_" + new Date().getTime();
        var user = {
            id: userID,
            name: userName,
            email: email,
            password: password,
            login_state: true,
            login_attempts: 0,
            user_blocked: false,
            login_token: generateNewToken()
        }

        db.collection("users").find({ email: email }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length <= 0) {
                db.collection("users").insertOne(user, function (error, result) {
                    if (error) {
                        console.log(err.toString());
                        response.write(REPONSE_SIGNED_UP + RESPONSE_FAILED);
                        response.end();
                    } else {
                        response.write(REPONSE_SIGNED_UP + RESPONSE_SUCCESSFUL);
                        response.end();
                    }
                });
            } else {
                response.write(REPONSE_SIGNED_UP + RESPONSE_DUPLICATE);
                response.end();
            }
        });
    });

}

function login(message) {
    var messageString = message.toString().split(" ");
    var email = messageString[1];
    var password = messageString[2];
    var state_lock = messageString[3];

    MongoClient.connect(usersDBurl, function (err, client) {
        var db = client.db("next-cache");
        if (err) {
            throw err
        };

        db.collection("users").find({ email: email }).toArray(function (err, result) {
            if (err || result.length <= 0) {
                response.write(RESPONSE_FAILED);
                response.end();
            } else {
                if (result[0].password === password) {
                    if (result[0].login_state === true) {
                        reponse.write(RESPONSE_ALREADY_LOGGED_IN);
                        response.end();
                    } else {
                        if (result[0].user_blocked === false) {
                            db.collection("users").updateOne({ email: result[0].email }, {
                                $set: { login_state: true, login_token: generateNewToken(), login_attempts: 0 },
                            }, function (err, res) {
                                if (err) {
                                    response.write(RESPONSE_FAILED);
                                    response.end();
                                    console.log(err.toString());
                                }
                                if (state_lock !== true)
                                    setTimeout(login_timeout(result[0].id, db), 4 * 60 * 60 * 1000);

                                response.write(RESPONSE_LOGGED_IN + RESPONSE_SUCCESSFUL);
                                response.write("\ntoken: " + result[0].login_token);
                                response.end();

                            });
                        } else {
                            response.write(RESPONSE_BLOCKED);
                        }

                    }
                } else {
                    db.collection("users").find({ email: email }).toArray(function (err, result) {
                        db.collection("users").updateOne({ email: result[0].email }, {
                            $set: { login_attempts: (result[0].login_attempts + 1), login_token: null }
                        }, function (err, res) {
                            if (err) {
                                response.write(RESPONSE_FAILED);
                                response.end();
                                console.log(err.toString());
                            }

                            if (result[0].login_attempts == MAX_LOGIN_ATTEMPTS) {
                                db.collection("users").updateOne({ email: result[0].email }, {
                                    $set: { user_blocked: true, login_token: null }
                                }, function (err, res) {
                                    if (err) {
                                        response.write(RESPONSE_FAILED);
                                        response.end();
                                        console.log(err.toString());
                                    }

                                    setTimeout(blockCoolDown(result[0].id, db), BLOCK_COOLDOWN);

                                });
                            }

                        });
                    });

                    response.write(RESPONSE_FAILED);
                    response.write(RESPONSE_INVALID_CRED);
                    response.end();

                }
            }
        });
    });
}

function logout(message) {

    var login_token = message.split(" ")[1];
    MongoClient.connect(usersDBurl, function (err, client) {
        var db = client.db("next-cache");
        if (err) {
            throw err
        };

        db.collection("users").find({ login_token: login_token }).toArray(function (err, result) {
            if (err || result.length <= 0) {
                reponse.write(RESPONSE_ALREADY_LOGGED_OUT)
                response.end();
            } else {
                db.collection("users").updateOne(
                    { login_token: login_token },
                    { $set: { login_token: null, login_state: false } },
                    (err, res) => {
                        if (err) {
                            console.log(err.toString());
                            reponse.write(RESPONSE_LOGGED_OUT + RESPONSE_FAILED);
                            response.end();
                        } else {
                            reponse.write(RESPONSE_LOGGED_OUT + RESPONSE_SUCCESSFUL);
                            reponse.end();
                        }
                    }
                )
            }
        });
    });
}

function generateNewToken() {
    return ("token-" + new Date().getTime());
}

function login_timeout(id, db) {
    db.collection("users").updateOne(
        { id: id },
        { $set: { login_state: false } },
        function (err, res) {
            if (err)
                console.log(err.toString());

            console.log(res.toString());
        }
    );

}

function blockCoolDown(id, db) {
    db.collection("users").updateOne(
        { id: id },
        { $set: { user_blocked: false } },
        function (err, res) {
            if (err)
                console.log(err.toString());
            console.log(res.toString());
        }
    )
}