import { Router } from "express";
import callProcedure from "../libs/callProcedure.js";
import onErrorResponse from "../libs/onErrorResponse.js";

const router = Router();

/* Convocatorias */
router.get("/convocatorias/periodo/:periodo", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "consultar_convocatorias_gestion_periodo",
      [
        req.params.periodo,
        req.query.solo_activas === undefined ? 0 : req.query.solo_activas,
      ]
    );

    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get(
  "/convocatorias/periodo/:periodo/participaciones",
  async (req, res) => {
    try {
      if (
        req.role === "estudiante" &&
        req.query.est_DNI !== req.user.username
      ) {
        return res
          .status(403)
          .json({ message: "Cannot query someone elses participation." });
      }

      const [result] = await callProcedure(
        req.user.username,
        req.user.password,
        "consultar_participaciones_convocatorias_gestion_periodo",
        [req.params.periodo, req.query.est_DNI ? req.query.est_DNI : null]
      );

      res.json(result[0]);
    } catch (e) {
      onErrorResponse(res, e);
    }
  }
);

router.get("/convocatorias/:con_id", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "consultar_convocatorias_gestion_id",
      [
        req.params.con_id,
        req.query.solo_activas === undefined ? 0 : req.query.solo_activas,
      ]
    );

    if (result[0].length !== 0) {
      res.json(result[0][0]);
    } else {
      res
        .status(404)
        .json({
          message: `No${
            req.query.solo_activas === "1" ? " active " : " "
          }convocatorias with id ${req.params.con_id}`,
        });
    }
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/convocatorias/:con_id/participaciones", async (req, res) => {
  try {
    if (req.role === "estudiante" && req.query.est_DNI !== req.user.username) {
      return res
        .status(403)
        .json({ message: "Cannot query someone elses participation." });
    }

    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "consultar_participaciones_convocatorias_gestion_id",
      [req.params.con_id, req.query.est_DNI ? req.query.est_DNI : null]
    );

    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.post("/convocatorias/:con_id/participaciones", async (req, res) => {
  try {
    const { DNI } = req.body;

    if (req.user.role === "estudiante" && req.user.username !== DNI) {
      return res
        .status(403)
        .json({
          message: "Not allowed to register a participation for someone else",
        });
    }

    await callProcedure(
      req.user.username,
      req.user.password,
      "registrar_participacion_convocatoria_gestion",
      [DNI, req.params.con_id]
    );

    res.status(201).json({ message: "Participation registered." });
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.put("/convocatorias/:con_id/participaciones/:DNI", async (req, res) => {
  try {
    const { estado } = req.body;

    await callProcedure(
      req.user.username,
      req.user.password,
      "actualizar_estado_participacion_convocatoria_gestion",
      [req.params.con_id, req.params.DNI, estado]
    );

    res.json({ message: "Participacion updated" });
  } catch (e) {
    onErrorResponse(res, e);
  }
});

export default router;
