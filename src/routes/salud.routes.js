import { Router } from "express";
import callProcedure from "../libs/callProcedure.js";
import onErrorResponse from "../libs/onErrorResponse.js";

const router = Router();

/* Medical appointments */
router.post("/citas-individuales", async (req, res) => {
  try {
    const { DNI, tipo_cita, fecha } = req.body;

    if (req.user.role === "estudiante" && req.user.username !== DNI) {
      return res
        .status(403)
        .json({ message: "Cannot schedule an appointment for someone else." });
    }

    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "agendar_cita_individual",
      [DNI, tipo_cita, fecha]
    );

    res.status(201).json({ message: "Appointment scheduled" });
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/citas-individuales", async (req, res) => {
  try {
    if (
      req.user.role === "estudiante" &&
      req.query.est_DNI !== req.user.username
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to query someone elses information." });
    }

    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      req.query.solo_proximas ? "consultar_info_proximas_citas_individuales" : "consultar_info_citas_individuales",
      [req.query.est_DNI ? req.query.est_DNI : null]
    );

    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.delete("/citas-individuales/:id", async (req, res) => {
  try {
    const [eventResult] = await callProcedure(
      req.user.username,
      req.user.password,
      "consultar_info_cita_individual_evento",
      [req.params.id]
    );

    if (!eventResult[0][0]) {
      return res
        .status(404)
        .json({ message: `No appointments with id ${req.params.id}` });
    }

    if (req.user.role === "estudiante") {
      if (eventResult[0][0].cit_est_per_DNI !== parseInt(req.user.username)) {
        return res.status(403).json({
          message: "Not allowed to cancel someone elses appointment.",
        });
      }
    }

    await callProcedure(
      req.user.username,
      req.user.password,
      "cancelar_cita_individual",
      [req.params.id]
    );

    res.json({ message: "Appointment canceled" });
  } catch (e) {
    onErrorResponse(res, e);
  }
});

/* Health profile information */
router.get("/perfiles-de-salud/estudiante/:DNI", async (req, res) => {
  try {
    if (
      req.user.role === "estudiante" &&
      req.user.username !== req.params.DNI
    ) {
      return res
        .status(403)
        .json({ message: "Not alllowed query someone elses information." });
    }

    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "obtener_info_salud_estudiante",
      [req.params.DNI]
    );

    if (result[0].length !== 0) {
      const profile = result[0][0];
      profile.perfsalud_discapacidades = profile.perfsalud_discapacidades ? profile.perfsalud_discapacidades.split("-") : [];
      profile.perfsalud_id_discapacidades =profile.perfsalud_id_discapacidades ? profile.perfsalud_id_discapacidades.split(",").map(i => parseInt(i)) : [];

      res.json(profile);
    } else {
      res
        .status(404)
        .json({ message: `No students with DNI ${req.params.DNI}` });
    }
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.put('/perfiles-de-salud/:id', async (req,res) => {
  try {
    const { perfsalud_peso, perfsalud_RH, perfsalud_estatura, perfsalud_id_discapacidades } = req.body;
    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "discapacidades_perfil",
      [req.params.id]
    );
    const former = result[0][0].perfsalud_id_discapacidades ?  result[0][0].perfsalud_id_discapacidades.split(",").map(i => parseInt(i)) : [];
    const toRemove = former.filter((i) => perfsalud_id_discapacidades.indexOf(i) === -1);

    toRemove.map( async (i) => {
      await callProcedure(
        req.user.username,
        req.user.password,
        "remover_discapacidad",
        [i, req.params.id]
      );
    });

    perfsalud_id_discapacidades.map(async (i) => {
      try {
        await callProcedure(
          req.user.username,
          req.user.password,
          "agregar_discapacidad",
          [i, req.params.id]
        );
      } catch (error) {
        
      }
    });

    await callProcedure(
      req.user.username,
      req.user.password,
      "actualizar_perfil_salud",
      [req.params.id, perfsalud_peso, perfsalud_RH, perfsalud_estatura]
    );

    res.json({message:"Profile updated"});

  } catch (e) {
    onErrorResponse(res,e);
  }
});

/* sick leaves */
router.post("/incapacidades", async (req, res) => {
  try {
    const { DNI, fecha_inicio, fecha_fin } = req.body;

    await callProcedure(
      req.user.username,
      req.user.password,
      "cargar_incapacidad",
      [DNI, fecha_inicio, fecha_fin]
    );

    res.status(201).json({ message: "Sick leave registered" });
  } catch (e) {
    onErrorResponse(res, e);
  }
});

router.get("/incapacidades", async (req, res) => {
  try {
    if (
      req.user.role === "estudiante" &&
      req.user.username !== req.query.est_DNI
    ) {
      return res
        .status(403)
        .json({ message: "Not alllowed query someone elses information." });
    }

    const [result] = await callProcedure(
      req.user.username,
      req.user.password,
      "consultar_info_incapacidades",
      [req.query.est_DNI ? req.query.est_DNI : null]
    );

    res.json(result[0]);
  } catch (e) {
    onErrorResponse(res, e);
  }
});

export default router;
