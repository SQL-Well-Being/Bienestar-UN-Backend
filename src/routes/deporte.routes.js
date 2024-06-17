import { Router } from "express";
import callProcedure from "../libs/callProcedure.js";
import onErrorResponse from "../libs/onErrorResponse.js";

const router = Router();

router.get("/selecciones-deportivas", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_selecciones_deportivas"
    );
    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/selecciones-deportivas/:id", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_seleccion_deportiva",
      [req.params.id]
    );
    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/convocatorias-selecciones", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_convocatorias_selecciones_deportivas"
    );
    res.json(result);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/selecciones-deportivas/entrenamientos/:id", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_entrenamientos_seleccion_deportiva",
      [req.params.id]
    );
    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/torneos", async (req, res) => {
  try {
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_torneos"
    );
    res.json(result);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

export default router;
