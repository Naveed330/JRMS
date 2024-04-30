import React, { useContext, useState } from 'react'
import { AuthContext } from '../Pages/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminSideBar = () => {
  const { state, logout } = useContext(AuthContext);
  const [propertiesAdmin, setPropertiesAdmin] = useState(false);
  const [isTenantOpenforAdmin, setIsTenantOpenforAdmin] = useState(false);
  const [isPaymentforAdmin, setIsPaymentforAdmin] = useState(false);
  const [maintainanceforAdmin, setMaintenanceforAdmin] = useState(false);
  const [administrationforAdmin, setadministrationforAdmin] = useState(false);
  const navigate = useNavigate()

  const toggleMenuforAdmin = () => {
    setPropertiesAdmin(!propertiesAdmin);
  };

  const toggleTennatsforAdmin = () => {
    setIsTenantOpenforAdmin(!isTenantOpenforAdmin)
  }

  const togglePaymentforAdmin = () => {
    setIsPaymentforAdmin(!isPaymentforAdmin);
  }

  const togglemaintenanceforAdmin = () => {
    setMaintenanceforAdmin(!maintainanceforAdmin);
  }

  const toggleadministrationforAdmin = () => {
    setadministrationforAdmin(!administrationforAdmin)
  }

  return (


    <nav className="sidebar sidebar-offcanvas mt-4" id="sidebar">
      <ul className="nav mt-2">
        <li className="nav-item nav-profile mt-5">
          <Link to="/admindashboard" className="nav-link">
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
          <Link className="nav-link" to="/registerofadmin">
            <span className="menu-title">Add Owner OR User</span>
            <i className="mdi mdi-home menu-icon" />
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/allusersofadmin"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <span className="menu-title">All Users</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-crosshairs-gps menu-icon" />
          </Link>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={toggleMenuforAdmin}
            aria-expanded={propertiesAdmin ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Properties</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${propertiesAdmin ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/addpropertyofadmin')} style={{ cursor: 'pointer' }} > Add Property </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/allpropertiesofadmin")} style={{ cursor: 'pointer' }} > All Properties </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addfloorofadmin")} style={{ cursor: 'pointer' }} > Floor Section </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addunitofadmin")} style={{ cursor: 'pointer' }} >  Unit Section </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={toggleTennatsforAdmin}
            aria-expanded={isTenantOpenforAdmin ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Tenants</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${isTenantOpenforAdmin ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addadmintenant")} style={{ cursor: 'pointer' }} > Add Tenants </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/alltenantofadmin")} style={{ cursor: 'pointer' }} > All Tenants </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={togglePaymentforAdmin}
            aria-expanded={isPaymentforAdmin ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Payment</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${isPaymentforAdmin ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/adminpdc")} style={{ cursor: 'pointer' }} > PDC </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/cashofadmin")} style={{ cursor: 'pointer' }} > Cash </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/bankofadmin")} style={{ cursor: 'pointer' }} > Bank </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={togglemaintenanceforAdmin}
            aria-expanded={maintainanceforAdmin ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Maintenance</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${maintainanceforAdmin ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addmaintenancecostofadmin")} style={{ cursor: 'pointer' }} > Add Maintenance Cost </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/maintaincecostofadmin")} style={{ cursor: 'pointer' }} > All Maintenance Record </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            onClick={toggleadministrationforAdmin}
            aria-expanded={administrationforAdmin ? "true" : "false"}
            aria-controls="auth"
          >
            <span className="menu-title" style={{ cursor: 'pointer' }}>Administration</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </a>
          <div className={`collapse ${administrationforAdmin ? 'show' : ''}`} id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/addadministrationfeeforadmin")} style={{ cursor: 'pointer' }} > Add Administration Fee </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/administrationrecordforadmin")} style={{ cursor: 'pointer' }} >  Administration Fee Record </a>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/finicialreportforadmin"
            aria-expanded="false"
            aria-controls="ui-basic"
          >
            <span className="menu-title">Finicial Report</span>
            {/* <i className="menu-arrow" /> */}
            <i className="mdi mdi-crosshairs-gps menu-icon" />
          </Link>
        </li>


        {/* <li className="nav-item">
          <Link
            className="nav-link"
            aria-expanded="false"
            aria-controls="ui-basic"
            to="/addpropertyofadmin">
            <span className="menu-title">Add Property</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/allpropertiesofadmin">
            <span className="menu-title">All Properties</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/addfloorofadmin">
            <span className="menu-title">Floor Section</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/addunitofadmin">
            <span className="menu-title">Unit Section</span>
            <i className="mdi mdi-contacts menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/addadmintenant">
            <span className="menu-title">Add Tenant</span>
            <i className="mdi mdi-chart-bar menu-icon" />
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/alltenantofadmin">
            <span className="menu-title">All Tenants</span>
            <i className="mdi mdi-chart-bar menu-icon" />
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/adminpdc">
            <span className="menu-title">PDC</span>
            <i className="mdi mdi-table-large menu-icon" />

          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/cashofadmin"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">Cash</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/bankofadmin"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">Bank</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/addmaintenancecostofadmin"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">Add Maintenance Cost</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/maintaincecostofadmin"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">All Maintenance Record</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li>

        <li className="nav-item">
            <Link
              className="nav-link"
              data-bs-toggle="collapse"
              to="/addadministrationfeeforadmin"
              aria-expanded="false"
              aria-controls="general-pages"
            >
              <span className="menu-title">Add Administration Fee</span>
              <i className="menu-arrow" />
              <i className="mdi mdi-medical-bag menu-icon" />
            </Link>

          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              data-bs-toggle="collapse"
              to="/administrationrecordforadmin"
              aria-expanded="false"
              aria-controls="general-pages"
            >
              <span className="menu-title"> Administration Fee Record</span>
              <i className="menu-arrow" />
              <i className="mdi mdi-medical-bag menu-icon" />
            </Link>

          </li> */}



        {/* <li className="nav-item">
          <Link className="nav-link" to="/addfloorofadmin">
            <span className="menu-title">Floor Section</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/addunitofadmin">
            <span className="menu-title">Unit Section</span>
            <i className="mdi mdi-contacts menu-icon" />
          </Link>
        </li>
        
       
        <li className="nav-item">
          <Link className="nav-link" to="/addtenantofadmin">
            <span className="menu-title">Add Tenant</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/alltenantofadmin">
            <span className="menu-title">All Tenants</span>
            <i className="mdi mdi-chart-bar menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/pdcofadmin">
            <span className="menu-title">PDC</span>
            <i className="mdi mdi-table-large menu-icon" />

          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/cashofadmin"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">Cash</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/bankofadmin"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">Bank</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/addmaintenancecostofadmin"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">Add Maintenance Cost</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/maintenancelistofadmin"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">All Maintenance Record</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li> */}

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

export default AdminSideBar