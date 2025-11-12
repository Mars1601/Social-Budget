'use strict';

import PhaseDAO from '../dao/phaseDAO.mjs';

class PhaseController {
  constructor() {
    this.phaseDAO = new PhaseDAO();
  }

  async getPhase() {
    return await this.phaseDAO.getPhase();
  }

  async updatePhase(phase, budget = null) {
    return await this.phaseDAO.updatePhase(phase, budget);
  }

  async resetAll() {
    return await this.phaseDAO.resetAll();
  }
}

export default PhaseController;
