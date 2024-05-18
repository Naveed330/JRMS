import React, { useContext } from 'react'
import { AuthContext } from '../Pages/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const OwnerSideBar = () => {
  const { state, logout } = useContext(AuthContext);

  return (


    <nav className="sidebar sidebar-offcanvas mt-4" id="sidebar">
      <ul className="nav mt-2">
        <li className="nav-item nav-profile mt-5">
          <Link to="/ownerdashboard" className="nav-link">
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
          <Link className="nav-link" to="/myproperties">
            <span className="menu-title">My Properties</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/alltenatsforowners">
            <span className="menu-title">My All Tenants</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/allownerpdc"> 
            <span className="menu-title">My Pdc</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/mybank"> 
            <span className="menu-title">Bank</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
         <li className="nav-item">
          <Link className="nav-link" to="/mycash">
            <span className="menu-title">Cash</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </Link>
        </li>
        {/* 
        <li className="nav-item">
          <Link className="nav-link" to="/addunit">
            <span className="menu-title">Unit Section</span>
            <i className="mdi mdi-contacts menu-icon" />
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
        <li className="nav-item">
          <Link
            className="nav-link"
            data-bs-toggle="collapse"
            to="/addmaintenancecost"
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
            to="/maintenancelist"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">All Maintenance Record</span>
            <i className="menu-arrow" />
            <i className="mdi mdi-medical-bag menu-icon" />
          </Link>

        </li>  */} 
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

export default OwnerSideBar