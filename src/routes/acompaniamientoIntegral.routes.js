import { Router } from "express";
import callProcedure from "../libs/callProcedure.js";
import onErrorResponse from "../libs/onErrorResponse.js";

const router = Router();

router.post("/citas-asesoria", async (req, res) => {
  try {
    const { DNI, tipo_cita, fecha } = req.body;

    if (req.user.role === "estudiante" && req.user.username !== DNI) {
      return res
        .status(403)
        .json({ message: "Cannot schedule an appointment for someone else." });
    }

    await callProcedure(
      req.user.username,
      req.user.password,
      "agendar_cita_asesoria",
      [DNI, tipo_cita, fecha]
    );

    res.status(201).json({ message: "Appointment scheduled." });
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.delete("/citas-asesoria/:id", async (req, res) => {
  try {
    const [eventResult] = await callProcedure(
      req.user.username,
      req.user.password,
      "consultar_info_cita_asesoria_evento",
      [req.params.id]
    );

    if (!eventResult[0][0]) {
      return res
        .status(404)
        .json({ message: `No appointments with id ${req.params.id}` });
    }

    if (req.user.role === "estudiante") {
      if (
        eventResult[0][0].cit_ase_est_per_DNI !== parseInt(req.user.username)
      ) {
        return res.status(403).json({
          message: "Not allowed to cancel someone elses appointment.",
        });
      }
    }

    await callProcedure(
      req.user.username,
      req.user.password,
      "cancelar_cita_asesoria",
      [req.params.id]
    );

    res.json({ message: "Appointment canceled" });
  } catch (e) {
    onErrorResponse(res, e);
  }
});

export default router;
