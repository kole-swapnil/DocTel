import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback,
} from "reactstrap";
import "../App.css";
import { render } from "react-dom";
import Axios from "axios";
require("dotenv").config();
const REACT_APP_PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const REACT_APP_PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;

class TreatmentComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patAadhar: 0,
      symptoms: "",
      medications: "",
      treatcount: 0,
      procedure: "",
      description: "",
      prescription: "",
      treatId: 0,
      loading: "",
      patstate: "Active",
      buffer: null,
      docaccount: "",
      docAadhar: 0,
      temperature: "",
      systolicBP: "",
      diastolicBP: "",
      heartRate: "",
    };
    this.handleSubmitadd = this.handleSubmitadd.bind(this);
    this.handleSubmitmod = this.handleSubmitmod.bind(this);
    this.handleSubmitsenddoc = this.handleSubmitsenddoc.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  uploadImage = async (x) => {
    console.log("API Key:", REACT_APP_PINATA_API_KEY);
    console.log("API Secret:", REACT_APP_PINATA_API_SECRET);
    console.log("Time start file to ipfs", Date.now());
    console.log("Submitting file to ipfs...");
    //adding file to the IPFS
    //console.log(this.state.buffer);
    try {
      const formData = new FormData();
      formData.append("file", this.state.buffer);

      const resFile = await Axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: REACT_APP_PINATA_API_KEY.toString(),
          pinata_secret_api_key: REACT_APP_PINATA_API_SECRET.toString(),
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(resFile);
      if (x == 1) {
        const res = this.props.contract.methods
          .addPrescriptionTreat(this.state.treatId, resFile.data.IpfsHash)
          .send({ from: this.props.accounts, gas: 1000000 })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
            console.log("Time end trans ended", Date.now());
          });
      } else if (x == 2) {
        const res = this.props.contract.methods
          .addReportTreat(this.state.treatId, resFile.data.IpfsHash)
          .send({ from: this.props.accounts, gas: 1000000 })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
            console.log("Time end trans ended", Date.now());
          });
      }
    } catch (err) {
      console.log(err);
    }
    console.log("Time end file uploaded", Date.now());
  };

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    this.setState({ buffer: file });
  };
  async handleSubmitadd(event) {
    const numberRegex = /^\d+(\.\d+)?$/;
    const { temperature, systolicBP, diastolicBP, heartRate} = this.state;

    if (
      !numberRegex.test(temperature) ||
      !numberRegex.test(systolicBP) ||
      !numberRegex.test(diastolicBP) ||
      !numberRegex.test(heartRate)
    ) {
      alert(
        "Please enter valid numeric values for all vital signs (digits with optional decimals)."
      );
      return;
    }
    console.log("Current State" + JSON.stringify(this.state));
    event.preventDefault();
    console.log("Time start Treatment Add", Date.now());
    console.log("Patient Aadhar", this.state.patAadhar);
    console.log("Temperature", this.state.temperature);
    console.log("Systolic BP", this.state.systolicBP);
    console.log("Diastolic BP", this.state.diastolicBP);
    console.log("Heart Rate", this.state.heartRate);
    const res = await this.props.contract.methods
      .addTreatment(
        localStorage.getItem("myAadhar"),
        this.state.patAadhar,
        this.state.temperature,
        this.state.systolicBP,
        this.state.diastolicBP,
        this.state.heartRate
      )
      .send({ from: this.props.accounts, gas: 1000000 });
    const treatcount = await this.props.contract.methods
      .treatmentCount()
      .call();
    this.setState({
      treatcount: treatcount,
    });
    console.log(this.state.treatcount);
    console.log("Time end Treatment Add", Date.now());
  }
  async handleSubmitsenddoc(event) {
    event.preventDefault();
    console.log("Time start Doctor added to Treatment", Date.now());
    const res = await this.props.contract.methods
      .addDoctorToTreatment(this.state.treatId, this.state.docAadhar)
      .send({ from: this.props.accounts, gas: 1000000 });
    console.log(res);
    console.log("Time end Doctor added to Treatment", Date.now());
  }

  async handleSubmitmod(event) {
    event.preventDefault();
    var patientstate = 0;
    if (this.state.patstate == "Recovered") {
      patientstate = 1;
    } else {
      patientstate = 2;
    }
    console.log("Current State" + JSON.stringify(this.state));
    let resi = await this.props.contract.methods
      .dotreatment(
        this.state.treatId,
        this.state.procedure,
        this.state.description,
        this.state.prescription,
        patientstate
      )
      .send({ from: this.props.accounts[0], gas: 1000000 });
    console.log(resi);
  }

  render() {
    return (
      <div className="container">
        <h2>Add Treatment</h2>

        <Form onSubmit={this.handleSubmitadd}>
          <FormGroup row>
            <Label htmlFor="patAadhar" md={2}>
              Patient Aadhar
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="patAadhar"
                name="patAadhar"
                placeholder="Patient Account Address"
                value={this.state.patAadhar}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="temperature" md={2}>
              Temperature (°C)
            </Label>
            <Col md={10}>
              <Input
                type="text"
                id="temperature"
                name="temperature"
                placeholder="e.g., 36.7"
                value={this.state.temperature}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label htmlFor="systolicBP" md={2}>
              Systolic BP (mmHg)
            </Label>
            <Col md={10}>
              <Input
                type="text"
                id="systolicBP"
                name="systolicBP"
                placeholder="e.g. 120"
                value={this.state.systolicBP}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label htmlFor="diastolicBP" md={2}>
              Diastolic BP (mmHg)
            </Label>
            <Col md={10}>
              <Input
                type="text"
                id="diastolicBP"
                name="diastolicBP"
                placeholder="e.g. 80"
                value={this.state.diastolicBP}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label htmlFor="heartRate" md={2}>
              Heart Rate (bpm)
            </Label>
            <Col md={10}>
              <Input
                type="text"
                id="heartRate"
                name="heartRate"
                placeholder="e.g. 85"
                value={this.state.heartRate}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col md={{ size: 8 }}>
              <Button type="submit" color="primary">
                Add Treatment
              </Button>
            </Col>
            <Col md={{ size: 2 }}>
              <Button color="success">{this.state.treatcount}</Button>
            </Col>
          </FormGroup>
        </Form>
        <br />
        <br />
        <h2>Add Doctor</h2>
        <Form onSubmit={this.handleSubmitsenddoc}>
          <FormGroup row>
            <Label htmlFor="treatId" md={2}>
              Treatment Id
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="treatId"
                name="treatId"
                placeholder="Treatment Id"
                value={this.state.treatId}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="docAadhar" md={2}>
              Doctor Aadhar
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="docAadhar"
                name="docAadhar"
                placeholder="Doctor Aadhar"
                value={this.state.docAadhar}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md={{ size: 8, offset: 2 }}>
              <Button type="submit" color="primary">
                Send Treatment
              </Button>
            </Col>
          </FormGroup>
        </Form>
        <br />
        <br />
        <h2>Add Prescription and Report</h2>
        <Form>
          <FormGroup row>
            <Label htmlFor="treatId" md={2}>
              Treatment Id
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="treatId"
                name="treatId"
                placeholder="Treatment Id"
                value={this.state.treatId}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="prescriptionUpload" className="ml-3">
              Prescription Upload
            </Label>
            <Input
              type="file"
              accept=".jpg, .jpeg, .png, .bmp, .gif"
              name="prescriptionUpload"
              onChange={this.captureFile}
            />
          </FormGroup>
          <FormGroup row>
            <div>
              <Button
                color="primary"
                onClick={() => {
                  this.uploadImage(1);
                }}
              >
                Add
              </Button>
            </div>
          </FormGroup>
        </Form>
        <Form>
          <FormGroup row>
            <Label htmlFor="treatId" md={2}>
              Treatment Id
            </Label>
            <Col md={10}>
              <Input
                type="number"
                id="treatId"
                name="treatId"
                placeholder="Treatment Id"
                value={this.state.treatId}
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="reportUpload" className="ml-3">
              Report Upload
            </Label>
            <Input
              type="file"
              accept=".jpg, .jpeg, .png, .bmp, .gif"
              name="reportUpload"
              onChange={this.captureFile}
            />
          </FormGroup>
          <FormGroup row>
            <div>
              <Button
                color="primary"
                onClick={() => {
                  this.uploadImage(2);
                }}
              >
                Add
              </Button>
            </div>
          </FormGroup>
        </Form>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default TreatmentComp;
