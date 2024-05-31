import { Router } from "express";
import { callProcedure } from "../libs/callProcedure.js";

const router = Router();

router.get("", async (req, res) => {
  try {
    const [ result ] = await callProcedure(
      req.session.user.username,
      req.session.user.password,
      "GetAllAuthors"
    );
    res.json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [ result ] = await callProcedure(
      req.session.user.username,
      req.session.user.password,
      "GetAuthor",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;
