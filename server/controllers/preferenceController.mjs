'use strict';

import PreferenceDAO from '../dao/preferenceDAO.mjs';

class PreferenceController {
  constructor() {
    this.dao = new PreferenceDAO();
  }

  async getPreference() {
    return this.dao.getPreference();
  }

  async insertPreference(user, voter, proposal, rating) {
    return this.dao.insertPreference(user, voter, proposal, rating);
  }

  async removePreference(user, proposal) {
    return this.dao.removePreference(user, proposal);
  }
}

export default PreferenceController;
