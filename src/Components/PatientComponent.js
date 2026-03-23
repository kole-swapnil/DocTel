import React, { Component } from "react";
import "../App.css";

class PatientComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patAadhar: "",
      weight: "",
      height: "",
      gender: "Male",
      bloodtype: "A",
      dob: "",
      location: "",
      validate: false,
      validateText: "",
      submitting: false,
      success: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.Gender = this.Gender.bind(this);
    this.Bloodtype = this.Bloodtype.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ success: false });
    if (this.handleValidateAll() === "ok") {
      const genderLocal = this.Gender(this.state.gender);
      const bloodtypeLocal = this.Bloodtype(this.state.bloodtype);
      const dobNew = +new Date(this.state.dob);
      this.setState({ submitting: true });
      try {
        await this.props.contract.methods
          .addPatient(
            this.state.patAadhar,
            this.state.weight,
            this.state.height,
            genderLocal,
            dobNew / 1000,
            bloodtypeLocal,
            this.state.location
          )
          .send({ from: this.props.accounts, gas: 1000000 });
        this.setState({ success: true, validate: false });
      } catch (err) {
        this.setState({ validate: true, validateText: `Transaction failed: ${err.message}` });
      } finally {
        this.setState({ submitting: false });
      }
    } else {
      this.setState({ validate: true });
    }
  }

  handleValidateAll = () => {
    const aadharStr = String(this.state.patAadhar);
    if (aadharStr.length > 10) {
      this.setState({ validateText: "Aadhar no. should be 10 digits" });
    } else if (aadharStr.length < 10) {
      this.setState({ validateText: "Aadhar no. should be 10 digits" });
    } else if (!new RegExp("^[0-9]*$").test(aadharStr)) {
      this.setState({ validateText: "Aadhar no. should contain only digits" });
    } else if (this.state.weight > 500000) {
      this.setState({ validateText: "Weight cannot be more than 500 kgs" });
    } else if (this.state.height > 300) {
      this.setState({ validateText: "Height cannot be more than 300 cms" });
    } else {
      this.setState({ validateText: "" });
      return "ok";
    }
  };

  Gender(genInput) {
    switch (genInput) {
      case "Male": return 0;
      case "Female": return 1;
      default: return 0;
    }
  }

  Bloodtype(bloodInput) {
    switch (bloodInput) {
      case "A": return 0;
      case "B": return 1;
      case "AB": return 2;
      case "O": return 3;
      default: return 0;
    }
  }

  render() {
    const { submitting, validate, validateText, success } = this.state;

    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 className="section-title">Register Patient</h2>
          <p className="section-subtitle">Add a new patient record to the blockchain</p>
        </div>

        {success && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#14532d",
            padding: "0.9rem 1.25rem", borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem", marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <i className="fa fa-check-circle" aria-hidden="true"></i>
            Patient registered successfully on-chain.
          </div>
        )}

        {validate && validateText && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
            padding: "0.9rem 1.25rem", borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem", marginBottom: "1.5rem",
          }}>
            {validateText}
          </div>
        )}

        <div style={{
          background: "#ffffff", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "2rem",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div className="dt-grid-2">
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="dt-label">Patient Aadhar <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                className="dt-input"
                type="text"
                name="patAadhar"
                placeholder="10-digit Aadhar number"
                value={this.state.patAadhar}
                onChange={this.handleInputChange}
                maxLength={10}
              />
            </div>

            <div>
              <label className="dt-label">Weight (kg)</label>
              <input
                className="dt-input"
                type="number"
                name="weight"
                placeholder="e.g. 70"
                value={this.state.weight}
                onChange={this.handleInputChange}
              />
            </div>

            <div>
              <label className="dt-label">Height (cm)</label>
              <input
                className="dt-input"
                type="number"
                name="height"
                placeholder="e.g. 175"
                value={this.state.height}
                onChange={this.handleInputChange}
              />
            </div>

            <div>
              <label className="dt-label">Gender</label>
              <select
                className="dt-input"
                name="gender"
                value={this.state.gender}
                onChange={this.handleInputChange}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="dt-label">Blood Type</label>
              <select
                className="dt-input"
                name="bloodtype"
                value={this.state.bloodtype}
                onChange={this.handleInputChange}
              >
                <option>A</option>
                <option>B</option>
                <option>AB</option>
                <option>O</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="dt-label">Date of Birth</label>
              <input
                className="dt-input"
                type="datetime-local"
                name="dob"
                value={this.state.dob}
                onChange={this.handleInputChange}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="dt-label">Location</label>
              <input
                className="dt-input"
                type="text"
                name="location"
                placeholder="City, Country"
                value={this.state.location}
                onChange={this.handleInputChange}
              />
            </div>
          </div>

          <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
            <button
              className="dt-btn dt-btn-primary"
              style={{ width: "100%", padding: "0.75rem" }}
              onClick={this.handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="dt-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                  Registering on blockchain...
                </>
              ) : (
                <>
                  <i className="fa fa-user-plus" aria-hidden="true"></i>
                  Register Patient
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientComp;
