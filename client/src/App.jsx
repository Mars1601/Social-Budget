import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Header from "./components/header/Header";
import Phase0 from "./components/phases/Phase0";
import Phase1 from "./components/phases/Phase1";
import Phase2 from "./components/phases/Phase2";
import Phase3 from "./components/phases/Phase3";
import AuthAPI from "./API/authAPI.mjs";
import ProposalAPI from "./API/proposalAPI.mjs";
import PhaseAPI from "./API/phaseAPI.mjs";
import "./App.css";

function App() {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // state USER, ISADMIN
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    const user = await AuthAPI.login(credentials);
    setUser(user);
    setIsAdmin(user.isadmin);
  };

  const handleLogout = async () => {
    await AuthAPI.logout();
    setUser(null);
    setIsAdmin(false);
  };

  // state phases
  const [phase, setPhase] = useState(4);

  // state BUDGET
  const [budget, setBudget] = useState(0);
  const handleBudget = (b) => {
    setBudget(b);
  };

  const [proposals, setProposals] = useState([]);

  // get current user info, if cookies are set
  useEffect(() => {
    setShouldRefresh(false);

    // get user and proposals according to the user log status
    AuthAPI.getUserInfo()
      .then((user) => user.json())
      .then((user) => {
        if (user) {
          setUser(user);
          setIsAdmin(user.isadmin);
          ProposalAPI.getAllProposals()
            .then((p) => setProposals(p))
            .catch((err) => console.error(err.message));
        } else {
          ProposalAPI.getApprovedProposals()
            .then((p) => setProposals(p))
            .catch((err) => console.error(err.message));
        }
      })
      .catch((err) => {
        setUser(null);
        setIsAdmin(false);
        ProposalAPI.getApprovedProposals()
          .then((propos) => setProposals(propos || []))
          .catch((err) => console.error(err.message));
      });

    // get phases and budget
    PhaseAPI.getPhase()
      .then((row) => {
        setPhase(row.phase || 0);
        setBudget(row.budget);
      })
      .catch((err) => console.error(err.message));
  }, [shouldRefresh]);

  return (
    <>
      <Header
        isAdmin={isAdmin}
        user={user}
        phase={phase}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        setShouldRefresh={setShouldRefresh}
        budget={budget}
      />

      <Container id="content" className="mb-5">
        {/* phase 0 - Budget definition */}
        {phase === 0 ? (
          isAdmin ? (
            <Phase0
              handleBudget={handleBudget}
              setShouldRefresh={setShouldRefresh}
            />
          ) : (
            <h3 className="text-center mt-5" style={{ marginTop: "6em" }}>
              Waiting for the admin to define the budget amount
            </h3>
          )
        ) : // phase 1 - Proposal insertion
        phase === 1 ? (
          user ? (
            <Phase1
              user={user}
              proposals={proposals}
              budget={budget}
              setShouldRefresh={setShouldRefresh}
            />
          ) : (
            <h3 className="text-center" style={{ marginTop: "6em" }}>
              Please login to insert a proposal
            </h3>
          )
        ) : // phase 2 - Preference assignment
        phase === 2 ? (
          !user ? (
            <h3 className="text-center" style={{ marginTop: "6em" }}>
              Please login to assign preferences
            </h3>
          ) : proposals.length === 0 ? (
            <h3 className="text-center" style={{ marginTop: "6em" }}>
              No proposals...
            </h3>
          ) : (
            <Phase2 proposals={proposals} user={user} />
          )
        ) : // Final phase - Decision announcement
        phase === 3 ? (
          proposals.length === 0 ? (
            <h3 className="text-center" style={{ marginTop: "6em" }}>
              No approved proposals...
            </h3>
          ) : (
            <Phase3 proposals={proposals} />
          )
        ) : (
          // Loading...
          <div className="text-center" style={{ marginTop: "6em" }}>
            <h3>Please wait... </h3>
          </div>
        )}
      </Container>
    </>
  );
}

export default App;
