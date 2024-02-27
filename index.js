const express = require('express');
const mongoose = require('mongoose');
const dbconfig = require('./config/dbconfig');
const unless = require("express-unless");
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const errors = require('./middleware/errors');



const app = express();

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbconfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected successfully");
}, (error) => {
    console.log("Database cannot be connected: " + error);
});


// Extend authenticateToken with unless functionality
auth.authenticateToken.unless = unless;

// Now use it with the conditions
app.use(auth.authenticateToken.unless({
    path: [
        { url: "/login", methods: ["POST"] },
        { url: "/register", methods: ["POST"] }
    ]
}));

// Initialize routes
app.use("/users", require("./routes/user-routes"));

// Middleware for error responses
app.use(errors.errorHandler);

// Listen for requests
app.listen(process.env.PORT || 4000, function () {
    console.log("Ready to Go!");
});
