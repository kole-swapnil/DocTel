import React, { Component } from "react";
import Axios from "axios";
import "../App.css";

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;

function FormSection({ title, icon, children }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: "var(--shadow-sm)",
      marginBottom: "1.5rem",
    }}>
      <div style={{
        padding: "1.25rem 1.75rem",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "0.95rem",
        }}>
          <i className={`fa fa-${icon}`} aria-hidden="true"></i>
        </div>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--dark)" }}>{title}</h3>
      </div>
      <div style={{ padding: "1.75rem" }}>
        {children}
      </div>
    </div>
  );
}

class TreatmentComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patAadhar: 0,
      treatcount: 0,
      treatId: 0,
      uploading: false,
      submitting: false,
      buffer: null,
      docAadhar: 0,
      temperature: "",
      systolicBP: "",
      diastolicBP: "",
      heartRate: "",
      error: null,
      success: null,
    };
    this.handleSubmitadd = this.handleSubmitadd.bind(this);
    this.handleSubmitsenddoc = this.handleSubmitsenddoc.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  uploadImage = async (x) => {
    this.setState({ uploading: true, error: null, success: null });
    try {
      const formData = new FormData();
      formData.append("file", this.state.buffer);

      const resFile = await Axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
          "Content-Type": "multipart/form-data",
        },
      });

      if (x === 1) {
        await this.props.contract.methods
          .addPrescriptionTreat(this.state.treatId, resFile.data.IpfsHash)
          .send({ from: this.props.accounts, gas: 1000000 });
        this.setState({ success: "Prescription uploaded and recorded on-chain." });
      } else if (x === 2) {
        await this.props.contract.methods
          .addReportTreat(this.state.treatId, resFile.data.IpfsHash)
          .send({ from: this.props.accounts, gas: 1000000 });
        this.setState({ success: "Report uploaded and recorded on-chain." });
      }
    } catch (err) {
      this.setState({ error: `Upload failed: ${err.message}` });
    } finally {
      this.setState({ uploading: false });
    }
  };

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    this.setState({ buffer: file });
  };

  async handleSubmitadd(event) {
    event.preventDefault();
    const numberRegex = /^\d+(\.\d+)?$/;
    const { temperature, systolicBP, diastolicBP, heartRate } = this.state;

    if (
      !numberRegex.test(temperature) ||
      !numberRegex.test(systolicBP) ||
      !numberRegex.test(diastolicBP) ||
      !numberRegex.test(heartRate)
    ) {
      this.setState({ error: "Please enter valid numeric values for all vital signs." });
      return;
    }

    this.setState({ submitting: true, error: null, success: null });
    try {
      await this.props.contract.methods
        .addTreatment(
          localStorage.getItem("myAadhar"),
          this.state.patAadhar,
          temperature,
          systolicBP,
          diastolicBP,
          heartRate
        )
        .send({ from: this.props.accounts, gas: 1000000 });
      const treatcount = await this.props.contract.methods.treatmentCount().call();
      this.setState({ treatcount, success: `Treatment added. Total treatments: ${treatcount}` });
    } catch (err) {
      this.setState({ error: `Transaction failed: ${err.message}` });
    } finally {
      this.setState({ submitting: false });
    }
  }

  async handleSubmitsenddoc(event) {
    event.preventDefault();
    this.setState({ submitting: true, error: null, success: null });
    try {
      await this.props.contract.methods
        .addDoctorToTreatment(this.state.treatId, this.state.docAadhar)
        .send({ from: this.props.accounts, gas: 1000000 });
      this.setState({ success: "Doctor assigned to treatment." });
    } catch (err) {
      this.setState({ error: `Transaction failed: ${err.message}` });
    } finally {
      this.setState({ submitting: false });
    }
  }

  render() {
    const { submitting, uploading, error, success } = this.state;

    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 className="section-title">Treatment Management</h2>
          <p className="section-subtitle">Create treatments, assign doctors, upload prescriptions and reports</p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
            padding: "0.9rem 1.25rem", borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem", marginBottom: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {error}</span>
            <button onClick={() => this.setState({ error: null })} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.6 }}>×</button>
          </div>
        )}

        {success && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#14532d",
            padding: "0.9rem 1.25rem", borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem", marginBottom: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span><i className="fa fa-check-circle" aria-hidden="true"></i> {success}</span>
            <button onClick={() => this.setState({ success: null })} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.6 }}>×</button>
          </div>
        )}

        {/* Add Treatment */}
        <FormSection title="Add New Treatment" icon="medkit">
          <div className="dt-grid-2">
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="dt-label">Patient Aadhar</label>
              <input
                className="dt-input"
                type="number"
                name="patAadhar"
                placeholder="Patient Aadhar number"
                value={this.state.patAadhar}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <label className="dt-label">Temperature (°C)</label>
              <input className="dt-input" type="text" name="temperature" placeholder="e.g. 36.7"
                value={this.state.temperature} onChange={this.handleInputChange} />
            </div>
            <div>
              <label className="dt-label">Heart Rate (bpm)</label>
              <input className="dt-input" type="text" name="heartRate" placeholder="e.g. 85"
                value={this.state.heartRate} onChange={this.handleInputChange} />
            </div>
            <div>
              <label className="dt-label">Systolic BP (mmHg)</label>
              <input className="dt-input" type="text" name="systolicBP" placeholder="e.g. 120"
                value={this.state.systolicBP} onChange={this.handleInputChange} />
            </div>
            <div>
              <label className="dt-label">Diastolic BP (mmHg)</label>
              <input className="dt-input" type="text" name="diastolicBP" placeholder="e.g. 80"
                value={this.state.diastolicBP} onChange={this.handleInputChange} />
            </div>
          </div>
          <button
            className="dt-btn dt-btn-primary"
            style={{ marginTop: "1.25rem", width: "100%", padding: "0.75rem" }}
            onClick={this.handleSubmitadd}
            disabled={submitting}
          >
            {submitting ? (
              <><div className="dt-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div> Adding...</>
            ) : (
              <><i className="fa fa-plus" aria-hidden="true"></i> Add Treatment</>
            )}
          </button>
        </FormSection>

        {/* Assign Doctor */}
        <FormSection title="Assign Doctor" icon="user-md">
          <div className="dt-grid-2">
            <div>
              <label className="dt-label">Treatment ID</label>
              <input className="dt-input" type="number" name="treatId" placeholder="Treatment ID"
                value={this.state.treatId} onChange={this.handleInputChange} />
            </div>
            <div>
              <label className="dt-label">Doctor Aadhar</label>
              <input className="dt-input" type="number" name="docAadhar" placeholder="Doctor Aadhar"
                value={this.state.docAadhar} onChange={this.handleInputChange} />
            </div>
          </div>
          <button
            className="dt-btn dt-btn-primary"
            style={{ marginTop: "1.25rem", width: "100%", padding: "0.75rem" }}
            onClick={this.handleSubmitsenddoc}
            disabled={submitting}
          >
            {submitting ? (
              <><div className="dt-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div> Assigning...</>
            ) : (
              <><i className="fa fa-stethoscope" aria-hidden="true"></i> Assign Doctor</>
            )}
          </button>
        </FormSection>

        {/* Prescription Upload */}
        <FormSection title="Upload Prescription" icon="file-text">
          <div className="dt-grid-2" style={{ alignItems: "end" }}>
            <div>
              <label className="dt-label">Treatment ID</label>
              <input className="dt-input" type="number" name="treatId" placeholder="Treatment ID"
                value={this.state.treatId} onChange={this.handleInputChange} />
            </div>
            <div>
              <label className="dt-label">Prescription File</label>
              <input
                className="dt-input"
                type="file"
                accept=".jpg,.jpeg,.png,.bmp,.gif"
                onChange={this.captureFile}
                style={{ paddingTop: "0.45rem" }}
              />
            </div>
          </div>
          <button
            className="dt-btn dt-btn-primary"
            style={{ marginTop: "1.25rem", width: "100%", padding: "0.75rem" }}
            onClick={() => this.uploadImage(1)}
            disabled={uploading}
          >
            {uploading ? (
              <><div className="dt-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div> Uploading to IPFS...</>
            ) : (
              <><i className="fa fa-upload" aria-hidden="true"></i> Upload Prescription</>
            )}
          </button>
        </FormSection>

        {/* Report Upload */}
        <FormSection title="Upload Report" icon="file-medical">
          <div className="dt-grid-2" style={{ alignItems: "end" }}>
            <div>
              <label className="dt-label">Treatment ID</label>
              <input className="dt-input" type="number" name="treatId" placeholder="Treatment ID"
                value={this.state.treatId} onChange={this.handleInputChange} />
            </div>
            <div>
              <label className="dt-label">Report File</label>
              <input
                className="dt-input"
                type="file"
                accept=".jpg,.jpeg,.png,.bmp,.gif"
                onChange={this.captureFile}
                style={{ paddingTop: "0.45rem" }}
              />
            </div>
          </div>
          <button
            className="dt-btn dt-btn-primary"
            style={{ marginTop: "1.25rem", width: "100%", padding: "0.75rem" }}
            onClick={() => this.uploadImage(2)}
            disabled={uploading}
          >
            {uploading ? (
              <><div className="dt-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div> Uploading to IPFS...</>
            ) : (
              <><i className="fa fa-upload" aria-hidden="true"></i> Upload Report</>
            )}
          </button>
        </FormSection>
      </div>
    );
  }
}

export default TreatmentComp;
