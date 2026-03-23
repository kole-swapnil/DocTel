import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { isNavOpen: false, showError: true };
    this.togglenav = this.togglenav.bind(this);
  }

  togglenav() {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  }

  truncateWallet(wallet) {
    if (!wallet || wallet === "0" || wallet === "null") return null;
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  }

  render() {
    const { connected, connecting, connectionError, connectWallet } = this.props;
    const aadhar = localStorage.getItem("myAadhar");
    const wallet = localStorage.getItem("wallet");
    const isLoggedIn = aadhar && aadhar !== "0" && aadhar !== "null";
    const truncatedWallet = connected ? this.truncateWallet(wallet) : null;

    return (
      <>
        <header className="dt-header">
          <div className="dt-header-inner">
            <NavLink to="/home" className="dt-brand">
              <div className="dt-brand-icon">
                <i className="fa fa-heartbeat" aria-hidden="true"></i>
              </div>
              <span className="dt-brand-name">DocTel</span>
            </NavLink>

            <nav className={`dt-nav ${this.state.isNavOpen ? "dt-nav-open" : ""}`}>
              <NavLink className="dt-nav-link" to="/home" activeClassName="dt-nav-active">Home</NavLink>
              <NavLink className="dt-nav-link" to="/signup" activeClassName="dt-nav-active">Register</NavLink>
              <NavLink className="dt-nav-link" to="/members" activeClassName="dt-nav-active">Members</NavLink>
              <NavLink className="dt-nav-link" to="/patient" activeClassName="dt-nav-active">Patient</NavLink>
              <NavLink className="dt-nav-link" to="/patdata" activeClassName="dt-nav-active">Patient Data</NavLink>
              <NavLink className="dt-nav-link" to="/treatment" activeClassName="dt-nav-active">Treatment</NavLink>
              <NavLink className="dt-nav-link" to="/treat" activeClassName="dt-nav-active">All Treatments</NavLink>
            </nav>

            <div className="dt-header-right">
              {connected ? (
                <>
                  {isLoggedIn && (
                    <div className="dt-wallet-chip logged-in">
                      <span className="dt-wallet-dot"></span>
                      <span className="dt-wallet-label">ID: {aadhar}</span>
                    </div>
                  )}
                  {truncatedWallet && (
                    <div className="dt-wallet-address" title={wallet}>
                      <i className="fa fa-link" aria-hidden="true"></i>
                      <span>{truncatedWallet}</span>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="dt-connect-btn"
                  onClick={connectWallet}
                  disabled={connecting}
                >
                  {connecting ? (
                    <>
                      <span className="dt-connect-spinner"></span>
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

              <button
                className="dt-hamburger"
                onClick={this.togglenav}
                aria-label="Toggle navigation"
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </header>

        {/* Connection error — slim non-blocking banner under the header */}
        {connectionError && this.state.showError && (
          <div className="dt-conn-error-bar">
            <span>
              <i className="fa fa-exclamation-circle" aria-hidden="true"></i>{" "}
              Wallet connection failed: {connectionError}
            </span>
            <button
              onClick={() => this.setState({ showError: false })}
              aria-label="Dismiss"
            >×</button>
          </div>
        )}

        <style>{`
          .dt-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(15, 23, 42, 0.97);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            height: 68px;
          }
          .dt-header-inner {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 1.5rem;
            height: 100%;
            display: flex;
            align-items: center;
            gap: 2rem;
          }
          .dt-brand {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            text-decoration: none;
            flex-shrink: 0;
          }
          .dt-brand-icon {
            width: 34px;
            height: 34px;
            background: linear-gradient(135deg, #0369a1, #0ea5e9);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.9rem;
          }
          .dt-brand-name {
            font-size: 1.2rem;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.02em;
          }
          .dt-nav {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            flex: 1;
          }
          .dt-nav-link {
            padding: 0.4rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: rgba(255,255,255,0.65);
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.15s ease;
            white-space: nowrap;
          }
          .dt-nav-link:hover {
            color: #ffffff;
            background: rgba(255,255,255,0.08);
          }
          .dt-nav-active {
            color: #ffffff !important;
            background: rgba(14, 165, 233, 0.15) !important;
          }
          .dt-header-right {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex-shrink: 0;
          }
          /* Connect Wallet button */
          .dt-connect-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.45rem 1rem;
            background: linear-gradient(135deg, #0369a1, #0ea5e9);
            color: #ffffff;
            font-size: 0.85rem;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            border: none;
            border-radius: 999px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(3, 105, 161, 0.4);
          }
          .dt-connect-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 14px rgba(3, 105, 161, 0.55);
          }
          .dt-connect-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .dt-connect-spinner {
            width: 12px;
            height: 12px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            display: inline-block;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          /* Wallet chips */
          .dt-wallet-chip {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.3rem 0.75rem;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 500;
            color: rgba(255,255,255,0.7);
          }
          .dt-wallet-chip.logged-in {
            border-color: rgba(16, 185, 129, 0.4);
            background: rgba(16, 185, 129, 0.08);
            color: #6ee7b7;
          }
          .dt-wallet-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #10b981;
            box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
          }
          .dt-wallet-address {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.3rem 0.75rem;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 999px;
            font-size: 0.78rem;
            font-family: 'Courier New', monospace;
            color: rgba(255,255,255,0.5);
          }
          /* Hamburger */
          .dt-hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            padding: 0.5rem;
            background: none;
            border: none;
            cursor: pointer;
          }
          .dt-hamburger span {
            display: block;
            width: 22px;
            height: 2px;
            background: rgba(255,255,255,0.7);
            border-radius: 2px;
          }
          /* Connection error banner */
          .dt-conn-error-bar {
            position: fixed;
            top: 68px;
            left: 0;
            right: 0;
            z-index: 999;
            background: #7f1d1d;
            border-bottom: 1px solid #991b1b;
            color: #fecaca;
            font-size: 0.82rem;
            padding: 0.55rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }
          .dt-conn-error-bar button {
            background: none;
            border: none;
            color: #fecaca;
            cursor: pointer;
            font-size: 1.1rem;
            line-height: 1;
            opacity: 0.7;
            flex-shrink: 0;
          }
          .dt-conn-error-bar button:hover { opacity: 1; }
          /* Mobile */
          @media (max-width: 900px) {
            .dt-nav {
              display: none;
              position: absolute;
              top: 68px;
              left: 0;
              right: 0;
              background: rgba(15, 23, 42, 0.98);
              flex-direction: column;
              padding: 1rem 1.5rem;
              gap: 0.25rem;
              border-bottom: 1px solid rgba(255,255,255,0.08);
            }
            .dt-nav-open {
              display: flex !important;
            }
            .dt-nav-link {
              padding: 0.6rem 0.75rem;
              width: 100%;
            }
            .dt-hamburger {
              display: flex;
            }
            .dt-wallet-address {
              display: none;
            }
          }
          @media (max-width: 480px) {
            .dt-connect-btn span:not(.dt-connect-spinner) {
              display: none;
            }
          }
        `}</style>
      </>
    );
  }
}

export default Header;
