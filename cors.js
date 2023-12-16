// cors.ts
import Cors from "micro-cors";

const cors = Cors({
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: [
    "https://devocode.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    // Add any other allowed origins
  ],
  optionsSuccessStatus: 204,
});

export default cors;
