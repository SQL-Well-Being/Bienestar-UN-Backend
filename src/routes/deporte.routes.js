import { Router } from "express";
import { callProcedure } from "../libs/callProcedure.js";

const router = Router();

router.get("/convocatorias-selecciones", async (req, res) => {
  try {
    const [ result ] = await callProcedure(
      req.session.user.username,
      req.session.user.password,
      "obtener_convocatorias_selecciones_deportivas"
    );
    res.json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.get("/convocatorias-selecciones/:id", async (req, res) => {
  try {
    const [ result ] = await callProcedure(
      req.session.user.username,
      req.session.user.password,
      "obtener_convocatoria_selecciones_deportivas",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;
