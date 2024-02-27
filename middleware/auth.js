//import { verify, sign } from "jsonwebtoken";
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {  
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1] 

  if (token == null) return res.sendStatus(401);

  verify(token, "Health_SecretKey", (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(username) {
  return sign({ data: username }, "Health_SecretKey", {
    expiresIn: "1h", //expires in 1 hour
  });
}

module.exports={
  authenticateToken,
  generateAccessToken,
};