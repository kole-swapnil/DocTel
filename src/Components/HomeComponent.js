import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

function FeatureCard({ icon, title, description, color }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "1.75rem",
      boxShadow: "var(--shadow-sm)",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1rem",
        fontSize: "1.25rem",
        color: "white",
      }}>
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
      </div>
      <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--dark)" }}>{title}</h4>
      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

function StatBadge({ icon, value, label }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "1rem 1.5rem",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "var(--radius)",
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "rgba(14, 165, 233, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#7dd3fc",
        fontSize: "1rem",
      }}>
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
      </div>
      <div>
        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginTop: "0.2rem" }}>{label}</div>
      </div>
    </div>
  );
}

function Home({ connected, connecting, connectWallet }) {
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0c2340 50%, #0d3251 100%)",
        padding: "5rem 1.5rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(14,165,233,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 40%)",
          pointerEvents: "none",
        }}></div>
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            background: "rgba(14, 165, 233, 0.15)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            borderRadius: 999,
            marginBottom: "1.5rem",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#0ea5e9", boxShadow: "0 0 8px rgba(14,165,233,0.8)", display: "inline-block" }}></span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#7dd3fc", letterSpacing: "0.03em" }}>Built on Ethereum · IPFS Storage</span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "1.25rem",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}>
            Decentralized<br />
            <span style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthcare Records</span>
          </h1>

          <p style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.65)",
            maxWidth: 520,
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}>
            Immutable patient records, transparent treatment history, and secure doctor-patient workflows — all on the blockchain.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {connected ? (
              <NavLink
                to="/signup"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.75rem",
                  background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
                  color: "#ffffff",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 14px rgba(3,105,161,0.5)",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <i className="fa fa-user-plus" aria-hidden="true"></i>
                Get Started
              </NavLink>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.75rem",
                  background: connecting
                    ? "rgba(14,165,233,0.5)"
                    : "linear-gradient(135deg, #0369a1, #0ea5e9)",
                  color: "#ffffff",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: connecting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: connecting ? "none" : "0 4px 14px rgba(3,105,161,0.5)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {connecting ? (
                  <>
                    <span style={{
                      width: 14, height: 14,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="fa fa-plug" aria-hidden="true"></i>
                    Connect Wallet
                  </>
                )}
              </button>
            )}
            <NavLink
              to="/treat"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.85)",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              <i className="fa fa-list-alt" aria-hidden="true"></i>
              View Treatments
            </NavLink>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          maxWidth: 860,
          margin: "3.5rem auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          position: "relative",
        }}>
          <StatBadge icon="shield" value="100%" label="Tamper-proof" />
          <StatBadge icon="user-md" value="On-chain" label="Doctor Network" />
          <StatBadge icon="file-text" value="IPFS" label="Secure File Storage" />
          <StatBadge icon="history" value="Full" label="Treatment Timeline" />
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--dark)", marginBottom: "0.5rem" }}>
            Everything you need for digital healthcare
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            End-to-end workflow from patient registration to treatment history
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          <FeatureCard
            icon="user-plus"
            title="Patient Registration"
            description="Register patients with their health profile including blood type, vitals, and demographic info — stored permanently on-chain."
            color="linear-gradient(135deg, #0369a1, #0ea5e9)"
          />
          <FeatureCard
            icon="stethoscope"
            title="Treatment Management"
            description="Create treatments, record vital signs, assign doctors, and upload prescriptions or lab reports via IPFS."
            color="linear-gradient(135deg, #059669, #10b981)"
          />
          <FeatureCard
            icon="file-medical"
            title="IPFS File Storage"
            description="Prescriptions and reports are pinned to IPFS via Pinata — decentralized, permanent, and accessible by anyone."
            color="linear-gradient(135deg, #7c3aed, #8b5cf6)"
          />
          <FeatureCard
            icon="history"
            title="Audit Trail"
            description="Every action emits a blockchain event — giving you a complete, chronological, tamper-proof audit trail for every treatment."
            color="linear-gradient(135deg, #0891b2, #06b6d4)"
          />
          <FeatureCard
            icon="users"
            title="Role-based Access"
            description="Separate roles for admins and doctors. Admins register patients; doctors view and update treatments assigned to them."
            color="linear-gradient(135deg, #b45309, #f59e0b)"
          />
          <FeatureCard
            icon="lock"
            title="Ethereum Security"
            description="Smart contract access controls ensure only authorized wallets can write data. No central server. No single point of failure."
            color="linear-gradient(135deg, #be123c, #f43f5e)"
          />
        </div>
      </section>

      {/* How it works */}
      <section style={{
        background: "var(--dark)",
        padding: "4rem 1.5rem",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
            How it works
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "3rem" }}>Three simple steps to get started</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            {[
              { step: "01", icon: "plug", title: "Connect Wallet", desc: "Connect MetaMask to authenticate. Your wallet address becomes your on-chain identity." },
              { step: "02", icon: "user-circle", title: "Register & Login", desc: "Admins and doctors register once. Login sets your Aadhar ID session for all operations." },
              { step: "03", icon: "medkit", title: "Manage Healthcare", desc: "Add patients, create treatments, assign doctors, record vitals, and upload reports." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ textAlign: "center" }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(6,182,212,0.1))",
                  border: "1.5px solid rgba(14,165,233,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.25rem",
                  color: "#7dd3fc",
                }}>
                  <i className={`fa fa-${icon}`} aria-hidden="true"></i>
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0ea5e9", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>STEP {step}</div>
                <h4 style={{ color: "#ffffff", fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h4>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
