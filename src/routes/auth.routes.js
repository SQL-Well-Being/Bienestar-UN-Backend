import { Router } from "express";
import { getConnection } from "../db.js";

const router = Router();

router.post("/login", async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;
    connection = await getConnection(username, password);

    const [result] = await connection.query("SELECT current_role()");
    req.session.user = {
      username: username,
      password: password,
      role: result[0]["current_role()"].match(new RegExp("`(.*)`@`%`"))[1], // User role came in form `role_name`@`%` from the database. I used regex to parse it and store only the role name.
    };
    res.json({ message: "Logged in successfully" });
  } catch (e) {
    return res.status(500).json({ message: e });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

router.post("/logout", async (req, res) => {
  req.session.user = undefined;
  return res.sendStatus(200);
});

export default router;
