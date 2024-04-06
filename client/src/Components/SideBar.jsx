import React, { useContext } from 'react'
import { AuthContext } from '../Pages/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const SideBar = () => {
  const { state, logout } = useContext(AuthContext);

  return (
    <nav className="sidebar sidebar-offcanvas mt-2" id="sidebar" style={{  height: 'auto' }} >
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
            <span className="menu-title">Register New User</span>
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
            <i className="menu-arrow" />
            <i className="mdi mdi-crosshairs-gps menu-icon" />
          </Link>


        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/addunit">
            <span className="menu-title">Unit Section</span>
            <i className="mdi mdi-contacts menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/addproperty">
            <span className="menu-title">Add Property</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/allproperties">
            <span className="menu-title">All Properties</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/addtenant">
            <span className="menu-title">Add Tenant</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/alltenant">
            <span className="menu-title">All Tenants</span>
            <i className="mdi mdi-chart-bar menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/pdc">
            <span className="menu-title">PDC</span>
            <i className="mdi mdi-table-large menu-icon" />

          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/cash"
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
            to="/bank"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">Bank</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
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
            {/*  <div className="mt-4">
            <div className="border-bottom">
              <p className="text-secondary">Categories</p>
            </div>
            <ul className="gradient-bullet-list mt-4">
              <li>Free</li>
              <li>Pro</li>
            </ul>
          </div> */}

          </span>
        </li>
      </ul>
    </nav>


  )
}

export default SideBar