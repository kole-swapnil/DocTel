import React, { Component } from "react";
import "../App.css";
import "./SignupComponent.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aadhar: 0,
      role: "",
      adminWallets: [],
      docAadhars: [],
      walletAddress: "",
      location: "",
      speciality: "",
      alertMsg: null,
      alertType: "warning",
      submitting: false,
    };
    this.handleSubmitDoctor = this.handleSubmitDoctor.bind(this);
    this.handleSubmitAdmin = this.handleSubmitAdmin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addingAdmin = this.addingAdmin.bind(this);
    this.addingDoctor = this.addingDoctor.bind(this);
    this.handleLogInAdmin = this.handleLogInAdmin.bind(this);
    this.handleLogInDoctor = this.handleLogInDoctor.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleSubmitAdmin(event) {
    event.preventDefault();
    if (this.handleValidateAdmin(this.props.accounts)) {
      this.addingAdmin();
    } else {
      this.setState({ alertMsg: "Account already exists. Login with a different wallet.", alertType: "warning" });
    }
  }

  async handleSubmitDoctor(event) {
    event.preventDefault();
    if (this.handleValidateDoctor(this.state.aadhar)) {
      this.addingDoctor();
    } else {
      this.setState({ alertMsg: "An account with this Aadhar already exists. Please login.", alertType: "warning" });
    }
  }

  addingAdmin = async () => {
    this.setState({ submitting: true, alertMsg: null });
    try {
      await this.props.contract.methods
        .addAdmin(this.state.aadhar, this.props.accounts, this.state.role)
        .send({ from: this.props.accounts, gas: 1000000 });
      this.setState({ alertMsg: "Admin registered successfully!", alertType: "success" });
    } catch (err) {
      this.setState({ alertMsg: `Transaction failed: ${err.message}`, alertType: "error" });
    } finally {
      this.setState({ submitting: false });
    }
  };

  addingDoctor = async () => {
    this.setState({ submitting: true, alertMsg: null });
    try {
      await this.props.contract.methods
        .addDoctor(
          this.state.aadhar,
          this.state.walletAddress,
          this.state.speciality,
          this.state.location
        )
        .send({ from: this.props.accounts, gas: 1000000 });
      this.setState({ alertMsg: "Doctor registered successfully!", alertType: "success" });
    } catch (err) {
      this.setState({ alertMsg: `Transaction failed: ${err.message}`, alertType: "error" });
    } finally {
      this.setState({ submitting: false });
    }
  };

  handleLogInAdmin = (event) => {
    event.preventDefault();
    if (!this.handleValidateAdmin(this.props.accounts)) {
      localStorage.setItem("myAadhar", this.state.aadhar);
      this.props.changeAadhar(localStorage.getItem("myAadhar"));
      this.setState({ alertMsg: "Logged in as admin.", alertType: "success" });
    } else {
      this.setState({ alertMsg: "No admin account found for this wallet. Please sign up first.", alertType: "warning" });
    }
  };

  handleLogInDoctor = (event) => {
    event.preventDefault();
    if (!this.handleValidateDoctor(this.state.aadhar)) {
      localStorage.setItem("myAadhar", this.state.aadhar);
      this.props.changeAadhar(localStorage.getItem("myAadhar"));
      this.setState({ alertMsg: "Logged in as doctor.", alertType: "success" });
    } else {
      this.setState({ alertMsg: "No doctor account found with this Aadhar. Please sign up first.", alertType: "warning" });
    }
  };

  handleLogOut = (event) => {
    event.preventDefault();
    localStorage.setItem("myAadhar", 0);
    this.props.changeAadhar(localStorage.getItem("myAadhar"));
    this.setState({ alertMsg: "Logged out successfully.", alertType: "success" });
  };

  handleValidateAdmin = (wallet) => {
    return !this.state.adminWallets.includes(wallet?.toString());
  };

  handleValidateDoctor = (aadhar) => {
    return !this.state.docAadhars.includes(aadhar?.toString());
  };

  async componentDidMount() {
    try {
      const resAdminCount = await this.props.contract?.methods.adminCount().call();
      const adminFetches = [];
      for (let i = 1; i <= resAdminCount; i++) {
        adminFetches.push(this.props.contract?.methods.adminIds(i).call());
      }
      const responseAdmins = await Promise.all(adminFetches);
      const adWallets = responseAdmins.map((ele) => ele.adminAddr);

      const resDoctorCount = await this.props.contract?.methods.doctorCount().call();
      const doctorFetches = [];
      for (let i = 1; i <= resDoctorCount; i++) {
        doctorFetches.push(this.props.contract?.methods.doctorIds(i).call());
      }
      const responseDoctors = await Promise.all(doctorFetches);
      const doctorAads = responseDoctors.map((ele) => ele.doctorAadhar);

      this.setState({ adminWallets: adWallets, docAadhars: doctorAads });
    } catch (err) {
      // Contract not available yet
    }
  }

  render() {
    const { submitting, alertMsg, alertType } = this.state;

    const alertStyles = {
      success: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#14532d" },
      warning: { background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" },
      error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" },
    };

    return (
      <div className="signup-page">
        <div style={{ marginBottom: "2rem" }}>
          <h2 className="section-title">Register / Login</h2>
          <p className="section-subtitle">Create your on-chain identity or login with an existing account</p>
        </div>

        {alertMsg && (
          <div style={{
            ...alertStyles[alertType],
            padding: "0.9rem 1.25rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span>{alertMsg}</span>
            <button
              onClick={() => this.setState({ alertMsg: null })}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", opacity: 0.6, lineHeight: 1 }}
            >×</button>
          </div>
        )}

        <div className="signup-grid">
          {/* Admin Panel */}
          <div className="signup-panel">
            <div className="signup-panel-header">
              <div className="signup-panel-icon admin-icon">
                <i className="fa fa-user-secret" aria-hidden="true"></i>
              </div>
              <div>
                <p className="signup-panel-title">Admin</p>
                <p className="signup-panel-subtitle">Hospital / Clinic Administrator</p>
              </div>
            </div>

            <div className="signup-field">
              <label className="dt-label">Aadhar Number</label>
              <input
                className="dt-input"
                type="number"
                name="aadhar"
                placeholder="Enter Aadhar Number"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-field">
              <label className="dt-label">Role / Designation</label>
              <input
                className="dt-input"
                type="text"
                name="role"
                placeholder="e.g. Hospital Admin"
                onChange={this.handleInputChange}
              />
            </div>

            <div className="signup-actions">
              <button
                className="signup-btn-full"
                onClick={this.handleSubmitAdmin}
                disabled={submitting}
              >
                <i className="fa fa-user-plus" aria-hidden="true"></i>{" "}
                {submitting ? "Signing Up..." : "Sign Up as Admin"}
              </button>
              <div className="signup-btn-row">
                <button
                  className="signup-btn-secondary"
                  onClick={this.handleLogInAdmin}
                  disabled={submitting}
                >
                  <i className="fa fa-sign-in" aria-hidden="true"></i> Log In
                </button>
                <button
                  className="signup-btn-logout"
                  onClick={this.handleLogOut}
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i> Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Doctor Panel */}
          <div className="signup-panel">
            <div className="signup-panel-header">
              <div className="signup-panel-icon doctor-icon">
                <i className="fa fa-user-md" aria-hidden="true"></i>
              </div>
              <div>
                <p className="signup-panel-title">Doctor</p>
                <p className="signup-panel-subtitle">Medical Professional</p>
              </div>
            </div>

            <div className="signup-field">
              <label className="dt-label">Wallet Address</label>
              <input
                className="dt-input"
                type="text"
                name="walletAddress"
                placeholder="0x..."
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-field">
              <label className="dt-label">Aadhar Number</label>
              <input
                className="dt-input"
                type="number"
                name="aadhar"
                placeholder="Enter Aadhar Number"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-field">
              <label className="dt-label">Speciality</label>
              <input
                className="dt-input"
                type="text"
                name="speciality"
                placeholder="e.g. Cardiology"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-field">
              <label className="dt-label">Location</label>
              <input
                className="dt-input"
                type="text"
                name="location"
                placeholder="City, Hospital"
                onChange={this.handleInputChange}
              />
            </div>

            <div className="signup-actions">
              <button
                className="signup-btn-full doctor-btn"
                onClick={this.handleSubmitDoctor}
                disabled={submitting}
              >
                <i className="fa fa-user-plus" aria-hidden="true"></i>{" "}
                {submitting ? "Signing Up..." : "Sign Up as Doctor"}
              </button>
              <div className="signup-btn-row">
                <button
                  className="signup-btn-secondary"
                  onClick={this.handleLogInDoctor}
                  disabled={submitting}
                >
                  <i className="fa fa-sign-in" aria-hidden="true"></i> Log In
                </button>
                <button
                  className="signup-btn-logout"
                  onClick={this.handleLogOut}
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
