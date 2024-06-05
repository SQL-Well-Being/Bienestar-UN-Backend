import { Router } from "express";
import { callProcedure } from "../libs/callProcedure.js";

const router = Router();

router.post("/citas-individuales", async (req, res) => {

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
        const  status = (e.sqlState === "45000" || e.sqlState === "23000") ? 400 : 500;
        res.status(status).json({message:e.message});
        res.status(500).json({message: e.message});
    }

});


router.get("/citas-individuales", async (req, res) => {
    try {
        if(req.session.user.role === "estudiante" && req.query.est_DNI !== req.session.user.username){
            return res.status(403).json({message:"Not allowed to query someone elses information."});
        }

        const [result] = await callProcedure(
            req.session.user.username,
            req.session.user.password,
            "consultar_info_citas_individuales",
            [req.query.est_DNI ? req.query.est_DNI : null]
        );

        res.json(result[0]);

    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.delete("/citas-individuales/:id", async (req, res) => {
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