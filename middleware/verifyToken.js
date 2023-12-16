import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/keys";

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
        console.log("Unauthorized");
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ error: "No token passed" });
    console.log("No token");
  }
};

module.exports = verifyToken;
