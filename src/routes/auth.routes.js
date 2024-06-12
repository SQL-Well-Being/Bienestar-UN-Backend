import { Router } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../db.js";
import { TOKEN_SECRET } from "../config.js";

const router = Router();

router.post("/login", async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;
    connection = await getConnection(username, password);

    const [result] = await connection.query("SELECT current_role()");

    const token = jwt.sign(
      {
        username: username,
        password: password,
      },
      TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.json({
      username: username,
      password: password,
      role: result[0]["current_role()"].match(new RegExp("`(.*)`@`%`"))[1], // User role came in form `role_name`@`%` from the database. I used regex to parse it and store only the role name.
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
});

export default router;
