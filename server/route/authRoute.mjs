'use string';

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserDAO from '../dao/userDAO.mjs';

class Authenticator {
  constructor(app) {
    this.app = app;
    this.router = new express.Router();
    this.userDAO = new UserDAO();
    this.initAuth();
  }

  getRouter() {
    return this.router;
  }

  initAuth() {
    const copyThis = this;

    // Configurazione passaport
    passport.use(
      new LocalStrategy(async function verify(username, password, callaback) {
        const user = await copyThis.userDAO.getUserByCredentials(username, password);
        if (!user) return callaback(null, false, 'Incorrect username or password');
        else return callaback(null, user);
      }),
    );

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      return done(null, user);
    });

    // Configurazione sessione
    this.app.use(
      session({
        secret: 'aaaa',
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 giorno
          sameSite: 'Strict',
        },
      }),
    );

    this.app.use(passport.authenticate('session'));

    // Authentication routes

    /**
     * ROUTE per il login
     */
    this.router.post('/', (req, res, next) => {
      this.login(req, res, next)
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(401).json(err));
    });

    /**
     * ROUTE per il logout
     */
    this.router.delete('/current', this.isLoggedIn, (req, res, next) => {
      this.logout(req, res, next)
        .then(() => res.status(200).end())
        .catch((err) => next(err));
    });

    /**
     * ROUTE per ottenere l'utente loggato
     */
    this.router.get('/current', (req, res) => {
      res.status(200).json(req.user);
    });
  }

  /**
   * funzione per il login
   * @param req
   * @param res
   * @param next
   * @returns una promessa che risolve con l'utente loggato
   */
  login(req, res, next) {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) reject(err);
        else if (!user) reject(info);
        else {
          // success, log in the user
          req.login(user, (err) => {
            if (err) reject(err);
            else resolve(user);
          });
        }
      })(req, res, next);
    });
  }

  /**
   * funzione per il logout
   * @param req
   * @param res
   * @param next
   * @returns una promessa che risolve con null
   */
  logout(req) {
    return new Promise((resolve, reject) => {
      req.logout(() => resolve(null));
    });
  }

  /**
   * Middleware per controllare se un utente è loggato
   */
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) next();
    else res.status(401).send('Unauthorized');
  }

  /**
   * Middleware per controllare se un utente è admin
   */
  isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isadmin) next();
    else res.status(403).send('Forbidden');
  }
}

export default Authenticator;
