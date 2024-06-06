import { Router } from "express";
import { callProcedure } from "../libs/callProcedure.js";
import onErrorResponse from "../libs/onErrorResponse.js";

const router = Router();

router.get("/informacion-academica/estudiante/:DNI", async (req, res) => {
    try {

        if(req.session.user.role === "estudiante" && req.session.user.username !== req.params.DNI){
            // Students are not allowed to query another student's data
            return res.status(403).json({message: "Not allowed to query someone elses information."});
        }

        const [result] = await callProcedure(
            req.session.user.username,
            req.session.user.password,
            "obtener_info_academica_estudiante",
            [req.params.DNI]
        );
        

        if(result[0].length !== 0){
            const studentInfo = result[0][0];

            // Some numeric fields were returned as text from the database, we need to cast them.
            studentInfo.creditos_cursados = parseInt(studentInfo.creditos_cursados);
            studentInfo.creditos_aprobados = parseInt(studentInfo.creditos_aprobados);
            studentInfo.PAPA = parseFloat(studentInfo.PAPA);
            studentInfo.porcentaje_avance = parseFloat(studentInfo.porcentaje_avance);

            res.json(studentInfo);

        } else {
            res.status(404);
            res.json({message: `No students with DNI ${req.params.DNI}`});
        }


    } catch (e) {
        onErrorResponse(res, e);
    }
});

export default router;
