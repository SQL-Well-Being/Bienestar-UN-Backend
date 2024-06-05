import { Router } from "express";
import { callProcedure } from "../libs/callProcedure.js";

const router = Router();

router.post('/citas-asesoria', async (req, res) => {
    try {
        const {DNI, tipo_cita, fecha} = req.body;
        
        await callProcedure(
            req.session.user.username,
            req.session.user.password,
            "agendar_cita_asesoria",
            [DNI, tipo_cita, fecha]
        );

        res.status(201).json({message: "Appointment scheduled."});

    } catch (e) {
        const  status = (e.sqlState === "45000" || e.sqlState === "23000") ? 400 : 500;
        res.status(status).json({message:e.message});
    }
});

router.delete('/citas-asesoria/:id', async (req, res) => {
    try {
        await callProcedure(
            req.session.user.username,
            req.session.user.password,
            "cancelar_cita_asesoria",
            [req.params.id]
        );

        res.json({message: "Appointment canceled"});

    } catch (e) {
        
        res.status(500).json({message: e.message});
    }
});



export default router;
