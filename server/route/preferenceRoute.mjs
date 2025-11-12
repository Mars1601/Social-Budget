'use strict';

import express from 'express';
import validateRequest from '../utilities.mjs';
import { body } from 'express-validator';
import PreferenceController from '../controllers/preferenceController.mjs';

class PreferenceRoutes {
  constructor(authenticator) {
    this.authenticator = authenticator;
    this.router = new express.Router();
    this.preferenceController = new PreferenceController();
    this.initRoutes();
  }

  getRouter() {
    return this.router;
  }

  initRoutes() {
    /**
     * Restituisce il punteggio di tutte le proposte
     */
    this.router.get('/', (req, res, next) => {
      this.preferenceController
        .getPreference()
        .then((score) => res.status(200).json(score))
        .catch((err) => next(err));
    });

    /**
     * Inserire o modificare il voto di una proposta
     * Richiede l'utente sia loggato
     */
    this.router.post(
      '/',
      this.authenticator.isLoggedIn,
      [body('idproposal').exists(), body('vote').isInt({ min: 0, max: 3 }), validateRequest],
      (req, res, next) => {
        this.preferenceController
          .insertPreference(req.user, req.body.voter, req.body.idproposal, req.body.vote)
          .then((proposal) => res.status(200).json(proposal))
          .catch((err) => next(err));
      },
    );

    /**
     *Rimuovere il voto di una proposta
     * Richiede che l'utente sia loggato
     */
    this.router.delete('/', this.authenticator.isLoggedIn, [body('id').isInt(), validateRequest], (req, res, next) => {
      this.preferenceController
        .removePreference(req.user, req.body.id)
        .then((proposal) => res.status(200).json(proposal))
        .catch((err) => next(err));
    });
  }
}

export default PreferenceRoutes;
