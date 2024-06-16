import { Router } from "express";
import callProcedure from "../libs/callProcedure.js";
import onErrorResponse from "../libs/onErrorResponse.js";

const router = Router();

router.get("/gai", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_grupos_artisticos_institucionales"
    );
    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/talleres-culturales", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_talleres_culturales"
    );
    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/talleres-culturales/:id", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_taller_cultural",
      [req.params.id]
    );
    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/convocatorias-gai", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_convocatorias_gai"
    );
    res.json(result);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/gai/estudiantes/:id", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_estudiantes_pertenecen_gai",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/talleres-culturales/asistencia/:id", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_estudiantes_asistieron_taller_cultural",
      [req.params.id]
    );
    res.json(result);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.post("/talleres-culturales/asistencia/:id", async (req, res) => {
  try {
    const { DNI } = req.body;

    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "llenar_asistencia_taller_cultural",
      [DNI, req.params.id]
    );
    res.json(result);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

export default router;
