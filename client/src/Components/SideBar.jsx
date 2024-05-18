import React, { useContext, useState } from 'react'
import { AuthContext } from '../Pages/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
const SideBar = () => {
  const { state, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [maintainance, setMaintenance] = useState(false);
  const [administration, setadministration] = useState(false);
  const [isCaseOpen, setIsCaseOpen] = useState(false);
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTennats = () => {
    setIsTenantOpen(!isTenantOpen)
  }

  const togglePayment = () => {
    setIsPayment(!isPayment);
  }

  const togglemaintenance = () => {
    setMaintenance(!maintainance);
  }

  const toggleadministration = () => {
    setadministration(!administration)
  }

  const toggleCase = () => {
    setIsCaseOpen(!isCaseOpen)
  }
  return (
    <nav className="sidebar sidebar-offcanvas mt-4" id="sidebar">
      <ul className="nav mt-2">
        <li className="nav-item nav-profile mt-5">
          <Link to="/superadmindashboard" className="nav-link">
            <div className="nav-profile-image">
              <img src={state.user.picture} alt="profile" />
              <span className="login-status online" />
              {/*change to offline or busy as needed*/}
            </div>
            <div className="nav-profile-text d-flex flex-column">
              <span className="font-weight-bold mb-2">{state.user.name}</span>
              <span className="text-secondary text-small">{state.user.role}</span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            <span className="menu-title">Add Owner OR User</span>
            <i className="mdi mdi-home menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/allusers"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <span className="menu-title">All Users</span>
            {/* <i className="menu-arrow" /> */}
            <i className="mdi mdi-crosshairs-gps menu-icon" />
          </Link>
        </li>

   

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Properties</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${isMenuOpen ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/addproperty')} style={{ cursor: 'pointer' }} > Add Property </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/allproperties")} style={{ cursor: 'pointer' }} > All Properties </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addfloor")} style={{ cursor: 'pointer' }} > Floor Section </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addunit")} style={{ cursor: 'pointer' }} >  Unit Section </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={toggleTennats}
            aria-expanded={isTenantOpen ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Tenants</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${isTenantOpen ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addtenant")} style={{ cursor: 'pointer' }} > Add Tenants </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/alltenant")} style={{ cursor: 'pointer' }} > All Tenants </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={togglePayment}
            aria-expanded={isPayment ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Payment</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${isPayment ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/pdc")} style={{ cursor: 'pointer' }} > PDC </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/cash")} style={{ cursor: 'pointer' }} > Cash </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/bank")} style={{ cursor: 'pointer' }} > Bank </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={togglemaintenance}
            aria-expanded={maintainance ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Maintenance</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${maintainance ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addmaintenancecost")} style={{ cursor: 'pointer' }} > Add Maintenance Cost </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/maintenancelist")} style={{ cursor: 'pointer' }} > All Maintenance Record </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={toggleCase}
            aria-expanded={isTenantOpen ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>All Cases</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${isCaseOpen ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/allcasetenant")} style={{ cursor: 'pointer' }} > All Cases Tenants </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/alltenant")} style={{ cursor: 'pointer' }} > All Tenants </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={toggleadministration}
            aria-expanded={administration ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Administration</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${administration ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addadministrationfee")} style={{ cursor: 'pointer' }} > Add Administration Fee </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/administrationrecord")} style={{ cursor: 'pointer' }} >  Administration Fee Record </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/finicialreport"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <span className="menu-title">Finicial Report</span>
            {/* <i className="menu-arrow" /> */}
            <i className="mdi mdi-crosshairs-gps menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/generatereport"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <span className="menu-title">Generate Report</span>
            {/* <i className="menu-arrow" /> */}
            <i className="mdi mdi-crosshairs-gps menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/income"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <span className="menu-title">Income (Owner)</span>
            {/* <i className="menu-arrow" /> */}
            <i className="mdi mdi-crosshairs-gps menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/joveraincome"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <span className="menu-title">Income (Jovera)</span>
            {/* <i className="menu-arrow" /> */}
            <i className="mdi mdi-crosshairs-gps menu-icon" />
          </Link>
        </li>

        <li className="nav-item sidebar-actions">
          <span className="nav-link">
            <div className="border-bottom">
              {/* <h6 className="font-weight-normal mb-3">Projects</h6> */}
            </div>
            <button className="btn btn-block btn-lg btn-gradient-primary mt-4">
              Technical Support
            </button>
          </span>
        </li>
      </ul>
    </nav>
  )
}

export default SideBar