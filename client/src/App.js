import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './Pages/Register';
import HomePage from './Pages/HomePage.jsx'
import Login from './Pages/Login.jsx';
import SuperAdminRoute from './Pages/SuperAdminRoute.js';
import SuperAdminDashboard from './Pages/SuperAdminDashboard.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import AdminRoute from './Pages/AdminRoute.js';
import OwnerRoute from './Pages/OwnerRoute.js';
import OwnerDashboard from './Pages/OwnerDashboard.jsx';
import AllUsers from './Pages/SuperAdminPages/AllUsers.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx'
import OTP from './Pages/Otp.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'
import PageNotFound from './Pages/Error.js'
import AddProperty from './Pages/SuperAdminPages/AddProperty.jsx';
import AllProperties from './Pages/SuperAdminPages/AllProperties.jsx';
import AdminAddProperty from './Pages/AdminPages/AdminAddProperty.jsx';
import AllPropertiesForAdmin from './Pages/AdminPages/AllPropertiesForAdmin.jsx';
import MyProperties from './Pages/OwnerPages/MyProperties.jsx';
import AddFloor from './Pages/SuperAdminPages/AddFloor.jsx';
import AddUnit from './Pages/SuperAdminPages/AddUnit.jsx';
import AddTenantForm from './Pages/SuperAdminPages/AddTenant.jsx';
import AllTenants from './Pages/SuperAdminPages/AllTenants.jsx';
import PDC from './Pages/SuperAdminPages/PDC.jsx';
import Bank from './Pages/SuperAdminPages/Bank.jsx';
import Cash from './Pages/SuperAdminPages/Cash.jsx';
import Navbar from './Components/Navbar.jsx';
import TopNavbar from './Components/TopNavbar.jsx';
import PropertyDetails from './Pages/SuperAdminPages/PropertyDetails.jsx';
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="container-scroller">
          {/* <TopNavbar /> */}
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/home" element={<HomePage />} />

          <Route path="/register" element={<SuperAdminRoute ><Register /></SuperAdminRoute>} />
          <Route path="/allusers" element={<SuperAdminRoute ><AllUsers /></SuperAdminRoute>} />
          <Route path="/addproperty" element={<SuperAdminRoute ><AddProperty /></SuperAdminRoute>} />
          <Route path="/propertyDetails/:id" element={<SuperAdminRoute ><PropertyDetails /></SuperAdminRoute>} />
          <Route path="/addfloor" element={<SuperAdminRoute ><AddFloor /></SuperAdminRoute>} />
          <Route path="/addunit" element={<SuperAdminRoute ><AddUnit /></SuperAdminRoute>} />
          <Route path="/addtenant" element={<SuperAdminRoute ><AddTenantForm /></SuperAdminRoute>} />
          <Route path="/allproperties" element={<SuperAdminRoute ><AllProperties /></SuperAdminRoute>} />
          <Route path="/alltenant" element={<SuperAdminRoute ><AllTenants /></SuperAdminRoute>} />
          <Route path="/superadmindashboard" element={<SuperAdminRoute ><SuperAdminDashboard /></SuperAdminRoute>} />
          <Route path="/pdc" element={<SuperAdminRoute ><PDC /></SuperAdminRoute>} />
          <Route path="/bank" element={<SuperAdminRoute ><Bank /></SuperAdminRoute>} />
          <Route path="/cash" element={<SuperAdminRoute ><Cash /></SuperAdminRoute>} />




          <Route path="/admindashboard" element={<AdminRoute ><AdminDashboard /></AdminRoute>} />
          <Route path="/addpropertybyadmin" element={<AdminRoute ><AdminAddProperty /></AdminRoute>} />
          <Route path="/allpropertiesforadmin" element={<AdminRoute ><AllPropertiesForAdmin /></AdminRoute>} />

          <Route path="/ownerdashboard" element={<OwnerRoute ><OwnerDashboard /></OwnerRoute>} />
          <Route path="/myproperties" element={<OwnerRoute ><MyProperties /></OwnerRoute>} />
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
