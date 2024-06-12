import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Authorization denied" });
    }
    
    jwt.verify(token, TOKEN_SECRET, (e, user) => {
      if (e) {
        return res.status(401).json({ message: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
