'use strict';

import ProposalDAO from '../dao/proposalDAO.mjs';

class ProposalController {
  constructor() {
    this.dao = new ProposalDAO();
  }

  async getApprovedProposals() {
    return this.dao.getApprovedProposals();
  }

  async getProposals(user) {
    return this.dao.getProposals(user);
  }

  async insertProposal(user, proposal) {
    return this.dao.insertProposal(user, proposal);
  }

  async editProposal(user, proposal) {
    return this.dao.editProposal(user, proposal);
  }

  async removeProposal(proposal) {
    return this.dao.removeProposal(proposal);
  }

  async removeAllProposals() {
    return this.dao.removeAllProposals();
  }
}

export default ProposalController;
