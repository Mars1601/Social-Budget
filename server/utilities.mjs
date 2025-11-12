'use strict';

import { validationResult } from 'express-validator';

/**
 * Validates the request object and returns an error if the request object is not formatted properly
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns Returns the next function if there are no errors or a response with a status code of 422 if there are errors.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = 'The parameters are not formatted properly';
    return res.status(422).json({ message: error });
  } else return next();
};

export default validateRequest;
