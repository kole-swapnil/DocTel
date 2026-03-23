import React, { Component } from "react";
import "../App.css";

const BLOODTYPE = { "0": "A", "1": "B", "2": "AB", "3": "O" };
const GENDER    = { "0": "Male", "1": "Female" };

function PatientCard({ patient, onClick }) {
  const gender    = GENDER[patient.gender]    || patient.gender    || "—";
  const bloodtype = BLOODTYPE[patient.bloodType] || patient.bloodType || "—";

  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.25rem 1.5rem",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        transition: "all 0.18s ease",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.borderColor = "var(--primary-light)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "1rem",
      }}>
        <i className="fa fa-user" aria-hidden="true"></i>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: "var(--dark)", fontFamily: "'Courier New', monospace", fontSize: "0.95rem" }}>
          #{patient.patient_Id}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
          {gender} · {bloodtype} · {patient.location || "—"}
        </div>
      </div>
      <i className="fa fa-chevron-right" style={{ color: "var(--text-muted)", fontSize: "0.75rem" }} aria-hidden="true"></i>
    </div>
  );
}

class PatientDetailsComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPatients: [],
      loading: true,
      loadError: null,
      searchQuery: "",
      selectedPatient: null,
      // single-patient detail fetch
      detailTreatments: "",
      detailLoading: false,
    };
  }

  async componentDidMount() {
    await this.loadAllPatients();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.contract !== this.props.contract && this.props.contract) {
      await this.loadAllPatients();
    }
  }

  async loadAllPatients() {
    if (!this.props.contract) {
      this.setState({ loading: false });
      return;
    }
    this.setState({ loading: true, loadError: null });
    try {
      const count = await this.props.contract.methods.patientCount().call();
      const fetches = [];
      for (let i = 1; i <= Number(count); i++) {
        fetches.push(this.props.contract.methods.patientIds(i).call());
      }
      const patients = await Promise.all(fetches);
      this.setState({ allPatients: patients, loading: false });
    } catch (err) {
      this.setState({ loadError: err.message, loading: false });
    }
  }

  async selectPatient(patient) {
    this.setState({ selectedPatient: patient, detailLoading: true, detailTreatments: "" });
    try {
      const treatments = await this.props.contract.methods
        .getTreatmentGone(patient.patient_Id)
        .call();
      this.setState({ detailTreatments: treatments.join(", ") || "None", detailLoading: false });
    } catch (_) {
      this.setState({ detailTreatments: "—", detailLoading: false });
    }
  }

  render() {
    const { allPatients, loading, loadError, searchQuery, selectedPatient, detailLoading, detailTreatments } = this.state;

    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? allPatients.filter(p => String(p.patient_Id).includes(query) || (p.location || "").toLowerCase().includes(query))
      : allPatients;

    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 className="section-title">Patient Data</h2>
          <p className="section-subtitle">
            {loading ? "Loading..." : `${allPatients.length} patient${allPatients.length !== 1 ? "s" : ""} registered on-chain`}
          </p>
        </div>

        {/* Search bar */}
        <div style={{
          background: "#ffffff", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "1.25rem 1.5rem",
          boxShadow: "var(--shadow-sm)", marginBottom: "1.5rem",
        }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, position: "relative", minWidth: 180 }}>
              <i className="fa fa-search" aria-hidden="true" style={{
                position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)",
                color: "var(--text-muted)", fontSize: "0.85rem",
              }}></i>
              <input
                className="dt-input"
                style={{ paddingLeft: "2.25rem" }}
                type="text"
                placeholder="Search by Aadhar or location…"
                value={searchQuery}
                onChange={e => this.setState({ searchQuery: e.target.value, selectedPatient: null })}
              />
            </div>
            {searchQuery && (
              <button
                className="dt-btn dt-btn-ghost"
                onClick={() => this.setState({ searchQuery: "", selectedPatient: null })}
              >
                <i className="fa fa-times" aria-hidden="true"></i> Clear
              </button>
            )}
          </div>
        </div>

        {/* Detail panel — shown when a patient is selected */}
        {selectedPatient && (
          <div style={{
            background: "#ffffff", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", overflow: "hidden",
            boxShadow: "var(--shadow-sm)", marginBottom: "1.5rem",
          }}>
            {/* Card header */}
            <div style={{
              background: "linear-gradient(135deg, #0f172a, #0c2340)",
              padding: "1.25rem 1.5rem",
              display: "flex", alignItems: "center", gap: "1rem",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "rgba(14, 165, 233, 0.2)",
                border: "2px solid rgba(14, 165, 233, 0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#7dd3fc", fontSize: "1.25rem",
              }}>
                <i className="fa fa-user" aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Patient</div>
                <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.05rem", fontFamily: "'Courier New', monospace" }}>
                  #{selectedPatient.patient_Id}
                </div>
              </div>
              <button
                onClick={() => this.setState({ selectedPatient: null })}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {detailLoading ? (
                <div className="dt-loading"><div className="dt-spinner"></div>Loading details…</div>
              ) : (
                <div className="dt-grid-2" style={{ gap: "1.25rem 2rem" }}>
                  {[
                    { label: "Height",     value: selectedPatient.height    ? `${selectedPatient.height} cm` : "—", icon: "arrows-v" },
                    { label: "Weight",     value: selectedPatient.weight    ? `${selectedPatient.weight} kg` : "—", icon: "balance-scale" },
                    { label: "Gender",     value: GENDER[selectedPatient.gender]       || selectedPatient.gender    || "—", icon: "venus-mars" },
                    { label: "Blood Type", value: BLOODTYPE[selectedPatient.bloodType] || selectedPatient.bloodType || "—", icon: "tint" },
                    { label: "Location",   value: selectedPatient.location  || "—", icon: "map-marker" },
                    { label: "Treatments", value: detailTreatments || "None", icon: "medkit" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, background: "#f0f9ff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--primary)", fontSize: "0.85rem", flexShrink: 0, marginTop: "0.1rem",
                      }}>
                        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.1rem" }}>{label}</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--dark)" }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Patient list */}
        {loading ? (
          <div className="dt-loading"><div className="dt-spinner"></div>Loading patients…</div>
        ) : loadError ? (
          <div className="dt-alert dt-alert-error">
            <i className="fa fa-exclamation-circle" aria-hidden="true"></i> {loadError}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
            <i className="fa fa-search" style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.75rem", opacity: 0.3 }} aria-hidden="true"></i>
            <p>{query ? "No patients match your search." : "No patients registered yet."}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.map(p => (
              <PatientCard
                key={p.patient_Id}
                patient={p}
                onClick={() => this.selectPatient(p)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default PatientDetailsComp;
