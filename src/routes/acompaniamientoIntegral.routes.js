import { Router } from "express";
import { callProcedure } from "../libs/callProcedure.js";
import onErrorResponse from "../libs/onErrorResponse.js";

const router = Router();

router.post('/citas-asesoria', async (req, res) => {
    try {
        const {DNI, tipo_cita, fecha} = req.body;

        if(req.session.user.role === "estudiante" && req.session.user.username !== DNI){
            return res.status(403).json({message: "Cannot schedule an appointment for someone else."});
        }
        
        await callProcedure(
            req.session.user.username,
            req.session.user.password,
            "agendar_cita_asesoria",
            [DNI, tipo_cita, fecha]
        );

        res.status(201).json({message: "Appointment scheduled."});

    } catch (e) {
        
        onErrorResponse(res, e);
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
        
        onErrorResponse(res, e);
    }
});



export default router;
