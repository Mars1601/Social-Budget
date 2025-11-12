'use strict';

import express from 'express';
import validateRequest from '../utilities.mjs';
import { body } from 'express-validator';
import ProposalController from '../controllers/proposalController.mjs';

class ProposalRoutes {
  constructor(authenticator) {
    this.authenticator = authenticator;
    this.router = new express.Router();
    this.proposalController = new ProposalController();
    this.initRoutes();
  }

  getRouter() {
    return this.router;
  }

  initRoutes() {
    /**
     * Restituisce tutte le proposte approvate
     * Non richiede autenticazione
     */
    this.router.get('/approved', (req, res, next) => {
      this.proposalController
        .getApprovedProposals()
        .then((proposals) => res.status(200).json(proposals))
        .catch((err) => next(err));
    });

    /**
     * Restituisce tutte le proposte non approvate
     * Richiede autenticazione
     */
    this.router.get('/', this.authenticator.isLoggedIn, (req, res, next) => {
      this.proposalController
        .getProposals(req.user)
        .then((proposals) => res.status(200).json(proposals))
        .catch((err) => next(err));
    });

    /**
     * Inserisce una proposta
     * Richiede autenticazione
     */
    this.router.put(
      '/',
      this.authenticator.isLoggedIn,
      [body('description').isString().isLength({ max: 90 }), body('cost').isNumeric({ min: 0 }).default(0), validateRequest],
      (req, res, next) => {
        this.proposalController
          .insertProposal(req.user, req.body)
          .then((proposal) => res.status(200).json(proposal))
          .catch((err) => next(err));
      },
    );

    /**
     * Modifica una proposta
     * Richiede che utente è loggato
     */
    this.router.put(
      '/edit',
      this.authenticator.isLoggedIn,
      [
        body('id').exists().isNumeric({ min: 0 }),
        body('description').isString().default(''),
        body('cost').isNumeric({ min: 0 }).default(0),
        body('isApproved').isBoolean().default(false),
        validateRequest,
      ],
      (req, res, next) => {
        this.proposalController
          .editProposal(req.user, req.body)
          .then((proposal) => res.status(200).json(proposal))
          .catch((err) => next(err));
      },
    );

    /**
     * Rimuove una proposta
     * Richiede che l'utente sia loggato
     */
    this.router.delete('/', this.authenticator.isLoggedIn, [body('id').exists().isInt(), validateRequest], (req, res, next) => {
      this.proposalController
        .removeProposal(req.body)
        .then((proposal) => res.status(200).json(proposal))
        .catch((err) => next(err));
    });

    /**
     * Rimuove tutte le proposte
     * Richiede che l'utente sia un admin
     */
    this.router.delete('/all', this.authenticator.isAdmin, (req, res, next) => {
      this.proposalController
        .removeAllProposals()
        .then((ok) => res.status(200).json(ok))
        .catch((err) => next(err));
    });
  }
}

export default ProposalRoutes;
