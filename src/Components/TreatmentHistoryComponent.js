import React, { Component } from "react";
import moment from "moment";
import "./HistoryComp.css";

const ETHER = 1000000000000000000;

const getEventDisplayName = (eventName) => {
  switch (eventName) {
    case "treatAdded":
      return "Treatment Added";
    case "statsRecorded":
      return "Vitals Recorded";
    case "doctorAddedTreat":
      return "Doctor Assigned";
    case "PrescriptionAddedTreat":
      return "Prescription Added";
    case "ReportAddedTreat":
      return "Report Added";
    default:
      return eventName;
  }
};

function AllEventrender({ treatEv, contract, accounts }) {
  const getTimeFormat = (timeCreated) => {
    let day = moment.unix(timeCreated);
    let date = new Date(timeCreated * 1000);
    let time = day.format("MMMM Do, YYYY [at] h:mm A");
    return time;
  };

  return (
    <div className="eventbox">
      {(treatEv?.event === "PrescriptionAddedTreat" ||
        treatEv?.event === "ReportAddedTreat") && (
        <a
          href={`https://ipfs.io/ipfs/${
            treatEv?.returnValues.report || treatEv?.returnValues.prescription
          }`}
          target="_blank"
          rel="noreferrer"
        >
          <img
            style={{ maxWidth: "90%" }}
            src={`https://ipfs.io/ipfs/${
              treatEv?.returnValues.report || treatEv?.returnValues.prescription
            }`}
            alt="IPFS Content"
          />
        </a>
      )}

      <h6>Event: {getEventDisplayName(treatEv?.event)}</h6>

      {treatEv?.event === "doctorAddedTreat" && (
        <p>Doctor: {treatEv?.returnValues.docAadhar}</p>
      )}

      {treatEv?.event === "statsRecorded" && (
        <div>
          <p>Heart Rate: {treatEv?.returnValues.heartRate}</p>
          <p>Systolic BP: {treatEv?.returnValues.systolicBP}</p>
          <p>Diastolic BP: {treatEv?.returnValues.diastolicBP}</p>
          <p>Temperature: {treatEv?.returnValues.temperature}</p>
        </div>
      )}

      {treatEv?.event === "PrescriptionAddedTreat" && (
        <p style={{ wordWrap: "break-word" }}>
          Prescription: {treatEv?.returnValues.prescription}
        </p>
      )}

      {treatEv?.event === "ReportAddedTreat" && (
        <p style={{ wordWrap: "break-word" }}>
          Report: {treatEv?.returnValues.report}
        </p>
      )}

      <p>Time: {getTimeFormat(treatEv.returnValues.times)}</p>
      <br />
    </div>
  );
}

class TreatmentHistoryComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treatment: null,
      treatmentEvents: [],
    };
  }

  async componentDidMount() {
    const treatment = await this.props.contract?.methods
      .treatments(this.props.matchId)
      .call();

    const treatmentEvents = [
      ...this.props.treatAdded,
      ...this.props.statsRecorded,
      ...this.props.doctorAddedTreat,
      ...this.props.PrescriptionAddedTreat,
      ...this.props.ReportAddedTreat,
    ];

    treatmentEvents.sort(
      (a, b) => a.returnValues.times - b.returnValues.times
    );

    this.setState({ treatment, treatmentEvents });
  }

  render() {
    const eventItems = this.state.treatmentEvents.map((ev, idx) => (
      <div key={idx} className="events">
        <AllEventrender
          treatEv={ev}
          contract={this.props.contract}
          accounts={this.props.accounts}
        />
        <br />
        <br />
      </div>
    ));

    return (
      <div className="body_style">
        <br />
        <h2>Treatment History</h2>
        <br />
        <i className="fa fa-medkit fa-5x plotimage"></i>
        <div className="details">
          <p>
            <span className="column1">Treatment ID</span>{" "}
            <span className="column2">
              : {this.state.treatment?.treatment_Id}
            </span>
          </p>
          <p>
            <span className="column1">Patient Aadhar</span>{" "}
            <span className="column2">
              : {this.state.treatment?.patientAadhar}
            </span>
          </p>
          <p>
            <span className="column1">Admin Aadhar</span>{" "}
            <span className="column2">
              : {this.state.treatment?.adminAadhar}
            </span>
          </p>
        </div>
        <hr />
        <h2>Events</h2>
        <br />
        <div className="eventrow">{eventItems}</div>
        <br />
        <br />
      </div>
    );
  }
}

export default TreatmentHistoryComp;
