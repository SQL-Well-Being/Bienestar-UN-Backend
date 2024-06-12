import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { FRONTEND_URL } from "./config.js";
import { auth } from "./middlewares/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import acompaniamientoIntegralRoutes from "./routes/acompaniamientoIntegral.routes.js";
import culturaRoutes from "./routes/cultura.routes.js";
import deporteRoutes from "./routes/deporte.routes.js";
import saludRoutes from "./routes/acompaniamientoIntegral.routes.js";
import sistemaDeInformacionRoutes from "./routes/sistemaDeInformacion.routes.js";
import socioeconomicoRoutes from "./routes/gestionSocioeconomica.routes.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/acompaniamiento-integral", auth, acompaniamientoIntegralRoutes);
app.use("/cultura", auth, culturaRoutes);
app.use("/deporte", auth, deporteRoutes);
app.use("/salud", auth, saludRoutes);
app.use("/sistema-de-informacion", auth, sistemaDeInformacionRoutes);
app.use("/socioeconomico", auth, socioeconomicoRoutes);

export default app;
