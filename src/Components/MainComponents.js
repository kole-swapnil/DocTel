import React, { Component } from "react";
import BNContract from "../Contracts/DocTel.json";
import getWeb3 from "../getWeb3";
import "../App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import Home from "./HomeComponent";
import PatientComp from "./PatientComponent";
import SignUp from "./SignupComponent";
import TreatmentComp from "./TreatmentComponent";
import AllMemComponent from "./AllMemComponent";
import PatientDetailsComp from "./PatientDetailsComponent";
import AllTreatmentComponent from "./AllTreatmentComponent";
import TreatmentHistoryComp from "./TreatmentHistoryComponent";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      balance: 0,
      contract: null,
      treatAddedEvents: [],
      doctorAddedTreatEvents: [],
      PrescriptionAddedTreatEvents: [],
      ReportAddedTreatEvents: [],
      statsRecordedEvents: [],
      connecting: false,
      connectionError: null,
    };
    this.changeAadhar = this.changeAadhar.bind(this);
    this.renderCardWithId = this.renderCardWithId.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
  }

  componentDidMount = async () => {
    // Silently check if the wallet is already authorized (no MetaMask prompt).
    // eth_accounts returns [] if not yet authorized, without triggering a popup.
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          await this.connectWallet();
        }
      } catch (_) {
        // Not authorized yet — user will connect manually via the button
      }
    }
  };

  connectWallet = async () => {
    this.setState({ connecting: true, connectionError: null });
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      const networkId = Number(await web3.eth.net.getId());
      const deployedNetwork = BNContract.networks[networkId];
      const contractAddress = deployedNetwork?.address;

      if (!contractAddress) {
        throw new Error(
          `Contract not deployed on network ID ${networkId}. ` +
          `Please switch MetaMask to Polygon Amoy (network ID 80002).`
        );
      }

      const instance = new web3.eth.Contract(BNContract.abi, contractAddress);

      this.setState({
        web3,
        accounts: accounts[0],
        contract: instance,
        balance,
        connecting: false,
      });
      localStorage.setItem("wallet", accounts[0]);

      try {
        const [
          treatAddedEvents,
          doctorAddedTreatEvents,
          statsRecordedEvents,
          PrescriptionAddedTreatEvents,
          ReportAddedTreatEvents,
        ] = await Promise.all([
          instance.getPastEvents("treatAdded", { fromBlock: 11555373 }),
          instance.getPastEvents("doctorAddedTreat", { fromBlock: 11555373 }),
          instance.getPastEvents("statsRecorded", { fromBlock: 11555373 }),
          instance.getPastEvents("PrescriptionAddedTreat", { fromBlock: 11555373 }),
          instance.getPastEvents("ReportAddedTreat", { fromBlock: 11555373 }),
        ]);

        this.setState({
          treatAddedEvents,
          doctorAddedTreatEvents,
          PrescriptionAddedTreatEvents,
          ReportAddedTreatEvents,
          statsRecordedEvents,
        });
      } catch (_eventsError) {
        // RPC may reject broad log queries — app still works without history
      }
    } catch (error) {
      this.setState({ connectionError: error.message, connecting: false });
    }
  };

  changeAadhar = (aad) => {
    this.setState({ aadhar: aad });
  };

  renderCardWithId({ match }) {
    const id = match.params.id;
    return (
      <TreatmentHistoryComp
        contract={this.state.contract}
        accounts={this.state.accounts}
        matchId={id}
        treatAdded={this.state.treatAddedEvents?.filter(
          (token) => token.returnValues.treatId === id
        )}
        doctorAddedTreat={this.state.doctorAddedTreatEvents?.filter(
          (token) => token.returnValues.treatId === id
        )}
        PrescriptionAddedTreat={this.state.PrescriptionAddedTreatEvents?.filter(
          (token) => token.returnValues.treatId === id
        )}
        ReportAddedTreat={this.state.ReportAddedTreatEvents?.filter(
          (token) => token.returnValues.treatId === id
        )}
        statsRecorded={this.state.statsRecordedEvents?.filter(
          (token) => token.returnValues.treatId === id
        )}
      />
    );
  }

  render() {
    const { contract, connecting, connectionError } = this.state;

    return (
      <div className="App">
        <Header
          connected={!!contract}
          connecting={connecting}
          connectionError={connectionError}
          connectWallet={this.connectWallet}
        />
        <div className="page-content">
          <Switch>
            <Route
              exact
              path="/home"
              render={() => (
                <Home
                  contract={contract}
                  accounts={this.state.accounts}
                  connected={!!contract}
                  connecting={connecting}
                  connectWallet={this.connectWallet}
                />
              )}
            />
            <Route
              exact
              path="/patient"
              render={() => (
                <PatientComp
                  contract={contract}
                  accounts={this.state.accounts}
                />
              )}
            />
            <Route
              exact
              path="/signup"
              render={() => (
                <SignUp
                  contract={contract}
                  accounts={this.state.accounts}
                  changeAadhar={this.changeAadhar}
                />
              )}
            />
            <Route
              exact
              path="/treatment"
              render={() => (
                <TreatmentComp
                  contract={contract}
                  accounts={this.state.accounts}
                />
              )}
            />
            <Route
              exact
              path="/members"
              render={() => (
                <AllMemComponent
                  contract={contract}
                  accounts={this.state.accounts}
                />
              )}
            />
            <Route
              exact
              path="/patdata"
              render={() => (
                <PatientDetailsComp
                  contract={contract}
                  accounts={this.state.accounts}
                />
              )}
            />
            <Route
              exact
              path="/treat"
              render={() => (
                <AllTreatmentComponent
                  contract={contract}
                  accounts={this.state.accounts}
                />
              )}
            />
            <Route path="/treatment/:id" render={this.renderCardWithId} />
            <Redirect to="/home" />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Main;
