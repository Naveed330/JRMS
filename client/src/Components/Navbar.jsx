import React, { useContext } from 'react';
import { AuthContext } from '../Pages/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Navbar = () => {
    const { state, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userProfile = state.user ? (
        <div className="d-flex align-items-center">
            <div className="nav-profile-img">
                <img src={state.user.picture} alt="user" />
                <span className="availability-status online" />
            </div>
            <div className="nav-profile-text">
                <p className="mb-1 text-black">{state.user.name}</p>
            </div>
        </div>
    ) : null;

    return (
        <>
            <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                    <h1 style={{ marginTop: '10px', color: '#AE82CE', cursor: 'pointer' }} onClick={() => navigate('/superadmindashboard')} >JRMS</h1>
                </div>
                <div className="navbar-menu-wrapper d-flex align-items-stretch">
                    <button
                        className="navbar-toggler navbar-toggler align-self-center"
                        type="button"
                        data-toggle="minimize"
                    >
                        <span className="mdi mdi-menu" />
                    </button>
                    {/* <div className="search-field d-none d-md-block">
                        <form className="d-flex align-items-center h-100" action="#">
                            <div className="input-group">
                                <div className="input-group-prepend bg-transparent">
                                    <i className="input-group-text border-0 mdi mdi-magnify" />
                                </div>
                                <input
                                    type="text"
                                    className="form-control bg-transparent border-0"
                                    placeholder="Search projects"
                                />
                            </div>
                        </form>
                    </div> */}
                    <ul className="navbar-nav navbar-nav-right">
                        <li className="nav-item nav-profile dropdown">
                            <a
                                className="nav-link "
                                id="profileDropdown"
                                href="/"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {userProfile}
                            </a>

                        </li>

                        <li className="nav-item dropdown">
                            {/* Rest of your code */}
                        </li>
                        <li className="nav-item dropdown">
                            {/* Rest of your code */}
                        </li>
                        <li className="nav-item nav-logout d-none d-lg-block">
                            <a className="nav-link" onClick={handleLogout}>
                                <i className="mdi mdi-power" />
                            </a>
                        </li>

                    </ul>
                    <button
                        className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
                        type="button"
                        data-toggle="offcanvas"
                    >
                        <span className="mdi mdi-menu" />
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;