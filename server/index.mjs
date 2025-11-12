// imports
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import AuthRoutes from './route/authRoute.mjs';
import ProposalRoutes from './route/proposalRoute.mjs';
import PreferenceRoutes from './route/preferenceRoute.mjs';
import PhaseRoutes from './route/phaseRoute.mjs';

// init express
const app = new express();
const port = 3001;

const prefix = '/budgetsociale/api';

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }),
);

app.use(morgan('dev')); // Log requests to the console
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

//inizializza routes per l'app
const authRoutes = new AuthRoutes(app);
const proposalRoutes = new ProposalRoutes(authRoutes);
const preferenceRoutes = new PreferenceRoutes(authRoutes);
const phaseRoutes = new PhaseRoutes(authRoutes);

// set up routes
app.use(`${prefix}/sessions`, authRoutes.getRouter());
app.use(`${prefix}/proposals`, proposalRoutes.getRouter());
app.use(`${prefix}/preferences`, preferenceRoutes.getRouter());
app.use(`${prefix}/phase`, phaseRoutes.getRouter());

app.use((err, _1, res, _2) => {
  return res.status(306).json({ message: err.message ? err.message : err });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;
