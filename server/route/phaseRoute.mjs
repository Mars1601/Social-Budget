'use strict';

import express from 'express';
import validateRequest from '../utilities.mjs';
import { body } from 'express-validator';
import PhaseController from '../controllers/phaseController.mjs';

class PhaseRoutes {
  constructor(authenticator) {
    this.authenticator = authenticator;
    this.router = new express.Router();
    this.phaseController = new PhaseController();
    this.initRoutes();
  }

  getRouter() {
    return this.router;
  }

  initRoutes() {
    /**
     * Restituisce la fase attuale
     * non richiede autenticazione
     */
    this.router.get('/', (req, res, next) => {
      this.phaseController
        .getPhase()
        .then((phase) => res.status(200).json(phase))
        .catch((err) => next(err));
    });

    /**
     * Modifica la fase attuale
     */
    this.router.put('/', this.authenticator.isAdmin, [body('phase').isInt(), validateRequest], (req, res, next) => {
      this.phaseController
        .updatePhase(req.body.phase, req.body.budget || null)
        .then((updated) => res.status(200).json(updated))
        .catch((err) => next(err));
    });

    /**
     * Reset tutte le tabelle (proposals, phase, preferences)
     */
    this.router.delete('/', this.authenticator.isAdmin, (req, res, next) => {
      this.phaseController
        .resetAll()
        .then((reset) => res.status(200).json(reset))
        .catch((err) => next(err));
    });
  }
}

export default PhaseRoutes;
