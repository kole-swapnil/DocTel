import React, { Component } from "react";
import moment from "moment";
import "./HistoryComp.css";
import "../App.css";

const EVENT_CONFIG = {
  treatAdded: { label: "Treatment Added", icon: "medkit", color: "linear-gradient(135deg, #0369a1, #0ea5e9)" },
  statsRecorded: { label: "Vitals Recorded", icon: "heartbeat", color: "linear-gradient(135deg, #dc2626, #ef4444)" },
  doctorAddedTreat: { label: "Doctor Assigned", icon: "user-md", color: "linear-gradient(135deg, #059669, #10b981)" },
  PrescriptionAddedTreat: { label: "Prescription Added", icon: "file-text", color: "linear-gradient(135deg, #7c3aed, #8b5cf6)" },
  ReportAddedTreat: { label: "Report Added", icon: "file-medical", color: "linear-gradient(135deg, #0891b2, #06b6d4)" },
};

function getTimeFormat(timeCreated) {
  return moment.unix(timeCreated).format("MMM D, YYYY [at] h:mm A");
}

function TimelineEvent({ ev }) {
  const config = EVENT_CONFIG[ev?.event] || { label: ev?.event, icon: "circle", color: "#64748b" };

  return (
    <div className="timeline-item">
      <div className="timeline-dot"></div>
      <div className="timeline-card">
        <div className="timeline-card-header">
          <div className="timeline-event-name">
            <div className="timeline-event-icon" style={{ background: config.color }}>
              <i className={`fa fa-${config.icon}`} aria-hidden="true"></i>
            </div>
            {config.label}
          </div>
          <span className="timeline-time">
            <i className="fa fa-clock-o" aria-hidden="true"></i>{" "}
            {getTimeFormat(ev.returnValues.times)}
          </span>
        </div>

        {ev?.event === "doctorAddedTreat" && (
          <p className="timeline-detail">
            <strong>Doctor Aadhar:</strong> {ev.returnValues.docAadhar}
          </p>
        )}

        {ev?.event === "statsRecorded" && (
          <div className="dt-grid-2" style={{ gap: "0.4rem 1.5rem" }}>
            <p className="timeline-detail"><strong>Heart Rate:</strong> {ev.returnValues.heartRate} bpm</p>
            <p className="timeline-detail"><strong>Temperature:</strong> {ev.returnValues.temperature} °C</p>
            <p className="timeline-detail"><strong>Systolic BP:</strong> {ev.returnValues.systolicBP} mmHg</p>
            <p className="timeline-detail"><strong>Diastolic BP:</strong> {ev.returnValues.diastolicBP} mmHg</p>
          </div>
        )}

        {ev?.event === "PrescriptionAddedTreat" && (
          <div>
            <div className="timeline-ipfs-img">
              <a
                href={`https://ipfs.io/ipfs/${ev.returnValues.prescription}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://ipfs.io/ipfs/${ev.returnValues.prescription}`}
                  alt="Prescription"
                />
              </a>
            </div>
            <p className="timeline-hash">{ev.returnValues.prescription}</p>
          </div>
        )}

        {ev?.event === "ReportAddedTreat" && (
          <div>
            <div className="timeline-ipfs-img">
              <a
                href={`https://ipfs.io/ipfs/${ev.returnValues.report}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://ipfs.io/ipfs/${ev.returnValues.report}`}
                  alt="Report"
                />
              </a>
            </div>
            <p className="timeline-hash">{ev.returnValues.report}</p>
          </div>
        )}
      </div>
    </div>
  );
}

class TreatmentHistoryComp extends Component {
  constructor(props) {
    super(props);
    this.state = { treatment: null, treatmentEvents: [] };
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

    treatmentEvents.sort((a, b) => a.returnValues.times - b.returnValues.times);
    this.setState({ treatment, treatmentEvents });
  }

  render() {
    const { treatment, treatmentEvents } = this.state;

    return (
      <div className="history-page">
        {/* Treatment info */}
        <div className="history-header">
          <div className="history-icon">
            <i className="fa fa-medkit" aria-hidden="true"></i>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "var(--dark)" }}>
                Treatment History
              </h2>
              <span style={{
                padding: "0.2rem 0.65rem",
                background: "#e0f2fe",
                color: "#0369a1",
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                #{treatment?.treatment_Id}
              </span>
            </div>
            <div className="history-info-grid">
              <div className="history-info-item">
                <span className="history-info-label">Patient Aadhar</span>
                <span className="history-info-value">{treatment?.patientAadhar || "—"}</span>
              </div>
              <div className="history-info-item">
                <span className="history-info-label">Admin Aadhar</span>
                <span className="history-info-value">{treatment?.adminAadhar || "—"}</span>
              </div>
              <div className="history-info-item">
                <span className="history-info-label">Total Events</span>
                <span className="history-info-value">{treatmentEvents.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="events-section-title">
          <i className="fa fa-history" aria-hidden="true"></i> Event Timeline
        </div>

        {treatmentEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            <i className="fa fa-history" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem", opacity: 0.3 }} aria-hidden="true"></i>
            <p>No events recorded for this treatment yet.</p>
          </div>
        ) : (
          <div className="timeline">
            {treatmentEvents.map((ev, idx) => (
              <TimelineEvent key={idx} ev={ev} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default TreatmentHistoryComp;
