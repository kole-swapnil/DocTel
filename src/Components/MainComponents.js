import React, { Component } from "react";
import BNContract from "../Contracts/DocTel.json";
import getWeb3 from "../getWeb3";
import "../App.css";
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import Home from "./HomeComponent";
import PatientComp from "./PatientComponent";
import SignUp from "./SignupComponent";
import TreatmentComp from "./TreatmentComponent";
import AllMemComponent from "./AllMemComponent";
import PatientDetailsComp from "./PatientDetailsComponent";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            accounts: null,
            balance: 0,
            contract: null
        }
        this.changeAadhar = this.changeAadhar.bind(this);
    }

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const balance = await web3.eth.getBalance(accounts[0]);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = BNContract.networks[networkId];
            const instance = new web3.eth.Contract(
                BNContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({ 
                web3, 
                accounts: accounts[0], 
                contract: instance,
                balance: balance 
            });
            localStorage.setItem("wallet", accounts[0]);
        }
        catch (error) {

        }
    }

    changeAadhar = async(aad) => {
        this.setState({aadhar: aad});
        console.log(aad);
    }

    render () {
        return (
            <div className="App">
                <Header/>
                    <Switch>
                        <Route exact path="/home" component={() => <Home contract={this.state.contract} accounts={this.state.accounts} />}/>
                        <Route exact path="/patient" component={() => <PatientComp contract={this.state.contract} accounts={this.state.accounts}/>}/>
                        <Route exact path="/signup" component={() => <SignUp contract={this.state.contract} accounts={this.state.accounts} changeAadhar={this.changeAadhar}/>}/>
                        <Route exact path="/treatment" component={() => <TreatmentComp contract={this.state.contract} accounts={this.state.accounts}/>}/>
                        <Route exact path="/members" component={() => <AllMemComponent contract={this.state.contract} accounts={this.state.accounts}/>}/>
                        <Route exact path="/patdata" component={() => <PatientDetailsComp contract={this.state.contract} accounts={this.state.accounts}/>}/>
                        <Redirect to="/home"/>
                    </Switch>
                <Footer/>
            </div>
        )
    }
}

export default Main;
