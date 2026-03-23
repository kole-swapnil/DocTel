import React, { Component } from "react";
import "../App.css";
import "./AllMemComponent.css";

function DoctorCard({ doctor }) {
  return (
    <div className="member-card">
      <div className="member-avatar doctor-avatar">
        <i className="fa fa-user-md" aria-hidden="true"></i>
      </div>
      <span className="member-role-badge doctor-badge">
        <i className="fa fa-stethoscope" aria-hidden="true"></i> Doctor
      </span>
      <p className="member-aadhar">#{doctor?.doctorAadhar}</p>
      <p className="member-address">{doctor?.doctorAddress}</p>
      {doctor?.speciality && (
        <p className="member-specialty">{doctor.speciality}</p>
      )}
    </div>
  );
}

function AdminCard({ admin }) {
  if (!admin) return null;
  return (
    <div className="member-card">
      <div className="member-avatar admin-avatar">
        <i className="fa fa-user-secret" aria-hidden="true"></i>
      </div>
      <span className="member-role-badge admin-badge">
        <i className="fa fa-shield" aria-hidden="true"></i> Admin
      </span>
      <p className="member-aadhar">#{admin.adminAadhar}</p>
      <p className="member-address">{admin.adminAddr}</p>
      {admin.role && (
        <p className="member-specialty">{admin.role}</p>
      )}
    </div>
  );
}

class AllMemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { doctors: [], admins: [], loading: true };
  }

  async componentDidMount() {
    try {
      const [resDoctorCount, resAdminCount] = await Promise.all([
        this.props.contract?.methods.doctorCount().call(),
        this.props.contract?.methods.adminCount().call(),
      ]);

      const doctorFetches = [];
      for (let i = 1; i <= resDoctorCount; i++) {
        doctorFetches.push(this.props.contract?.methods.doctorIds(i).call());
      }
      const adminFetches = [];
      for (let i = 1; i <= resAdminCount; i++) {
        adminFetches.push(this.props.contract?.methods.adminIds(i).call());
      }

      const [responseDoctors, responseAdmins] = await Promise.all([
        Promise.all(doctorFetches),
        Promise.all(adminFetches),
      ]);

      this.setState({ doctors: responseDoctors, admins: responseAdmins, loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, doctors, admins } = this.state;

    if (loading) {
      return (
        <div className="members-page">
          <div className="dt-loading">
            <div className="dt-spinner"></div>
            Loading members...
          </div>
        </div>
      );
    }

    return (
      <div className="members-page">
        <div style={{ marginBottom: "2rem" }}>
          <h2 className="section-title">Network Members</h2>
          <p className="section-subtitle">
            {admins.length} admin{admins.length !== 1 ? "s" : ""} · {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} registered on-chain
          </p>
        </div>

        {admins.length > 0 && (
          <>
            <div className="members-section-label">
              <i className="fa fa-user-secret" aria-hidden="true"></i> Admins
            </div>
            <div className="members-grid">
              {admins.map((y) => (
                <AdminCard key={y.admin_Id} admin={y} />
              ))}
            </div>
          </>
        )}

        {doctors.length > 0 && (
          <>
            <div className="members-section-label">
              <i className="fa fa-user-md" aria-hidden="true"></i> Doctors
            </div>
            <div className="members-grid">
              {doctors.map((x) => (
                <DoctorCard key={x.doctor_Id} doctor={x} />
              ))}
            </div>
          </>
        )}

        {admins.length === 0 && doctors.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
            <i className="fa fa-users" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", opacity: 0.3 }} aria-hidden="true"></i>
            <p>No members registered yet.</p>
          </div>
        )}
      </div>
    );
  }
}

export default AllMemComponent;
