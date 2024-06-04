import { Router } from "express";
import { callProcedure } from "../libs/callProcedure.js";

const router = Router();

router.post("/agendamiento-citas", async (req, res) => {

    try {
        const {DNI, tipo_cita, fecha} = req.body;
    
        const[result] = await callProcedure(
            req.session.user.username,
            req.session.user.password,
            "agendar_cita_individual",
            [DNI, tipo_cita, fecha]
        );

        res.status(201).json({message: "Appointment scheduled"});

    } catch (e) {
        res.status(500).json({message: e.message});
    }

});


router.delete("/agendamiento-citas/:id", async (req, res) => {
    try {
        await callProcedure(
            req.session.user.username,
            req.session.user.password,
            "cancelar_cita_individual",
            [req.params.id]
        );

        res.json({message : "Appointment canceled"});

    } catch (e) {
        res.status(500).json({message : e.message});
    }
});

export default router;
