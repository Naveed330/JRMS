import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './Pages/Register';
import HomePage from './Pages/HomePage.jsx'
import Login from './Pages/Login.jsx';
import SuperAdminRoute from './Pages/SuperAdminRoute.js';
import SuperAdminDashboard from './Pages/SuperAdminDashboard.jsx';
import AdminRoute from './Pages/AdminRoute.js';
import OwnerRoute from './Pages/OwnerRoute.js';
import OwnerDashboard from './Pages/OwnerPages/OwnerDashboard.jsx';
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
import RegisterofAdmin from './Pages/AdminPages/RegisterofAdmin.jsx'
import PropertyDetails from './Pages/SuperAdminPages/PropertyDetails.jsx';
import PropertyDetailsForAdmin from './Pages/AdminPages/PropertyDetailsForAdmin.jsx';
import Contract from './Pages/SuperAdminPages/contract.jsx';
import TenantDetails from './Pages/SuperAdminPages/TenantDetails.jsx';
import Search from './Pages/SuperAdminPages/Search.jsx';
import AddMaintenanceCost from './Pages/SuperAdminPages/AddMaintenanceCost.jsx';
import MaintenanceList from './Pages/SuperAdminPages/MaintenanceList.jsx';
import AddAdministrationFee from './Pages/SuperAdminPages/AddAdministrationFee.jsx';
import AllTenantsForOwner from './Pages/OwnerPages/AllTenantsForOwner.jsx';
import TenantDetailsForOwner from './Pages/OwnerPages/TenantDetailsForOwner.jsx'
import MaintenanceForOwner from './Pages/OwnerPages/MaintenanceForOwner.jsx';
import AdminDashboard from './Pages/AdminPages/AdminDashboard.jsx';
import AllUsersofAdmin from './Pages/AdminPages/AllUsersofAdmin.jsx';
import Adminpdc from './Pages/AdminPages/Adminpdc.jsx';
import Admincash from './Pages/AdminPages/Admincash.jsx';
import Adminbank from './Pages/AdminPages/Adminbank.jsx';
import Adminmaintaincecost from './Pages/AdminPages/Adminmaintaincecost.jsx';
import Adminmaintaincerecord from './Pages/AdminPages/Adminmaintaincerecord.jsx';
import Admintenants from './Pages/AdminPages/Admintenants.jsx';
import Adminunitsection from './Pages/AdminPages/Adminunitsection.jsx';
import Adminfloor from './Pages/AdminPages/Adminfloor.jsx';
import AdministrationRecord from './Pages/SuperAdminPages/Adminstrationrecord.jsx';
import AdministrationRecordDetails from './Pages/SuperAdminPages/AdminstrationRecordDetails.jsx';
import AddAdminTenants from './Pages/AdminPages/AddAdminTenants.jsx'
import TenantDetailsofAdmin from './Pages/AdminPages/TenantDetailsofAdmin.jsx';
import OwnerPropertyDetails from './Pages/OwnerPages/OwnerPropertyDetails.jsx';
import AddAdministrationFeeforAdmin from './Pages/AdminPages/AddAdminstrationFeeForAdmin.jsx';
import AdministrationRecordForAdmin from './Pages/AdminPages/AdminstrationRecordForAdmin.jsx';
import FinancialReport from './Pages/FinancialReport.jsx';
import OwnerPdc from './Pages/OwnerPages/OwnerPdc.jsx';
import StaticTenantData from './Components/StaticTenantData.jsx';
import StaticTenantDataforAdmin from './Components/StaticDataForAdmin.jsx';
import StaticTenantDataforOwner from './Components/StaticDataForOwner.jsx';
import AdministrationRecordDetail from './Pages/SuperAdminPages/AdminstrationRecordDetails.jsx';
import AdministrationRecordDetailforAdmin from './Pages/AdminPages/AdministrationRecordDetailforAdmin.jsx';
import OwnerBank from './Pages/OwnerPages/OwnerBank.jsx';
import OwnerCash from './Pages/OwnerPages/OwnerCash.jsx';
import FinancialReportForAdmin from './Pages/AdminPages/FinicialReportForAdmin.jsx';
import Profile from './Pages/SuperAdminPages/Profile.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="container-scroller">
          <Navbar />
        </div>

        <Routes>

          {/*   Basic Routes   */}
          <Route path="/" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/finicialreport" element={<SuperAdminRoute ><FinancialReport /></SuperAdminRoute>} />


          {/* Super Admin Routes */}
          <Route path="/supersearch" element={<SuperAdminRoute ><Search /></SuperAdminRoute>} />
          <Route path="/addmaintenancecost" element={<SuperAdminRoute ><AddMaintenanceCost /></SuperAdminRoute>} />
          <Route path="/maintenancelist" element={<SuperAdminRoute ><MaintenanceList /></SuperAdminRoute>} />
          <Route path="/addadministrationfee" element={<SuperAdminRoute ><AddAdministrationFee /></SuperAdminRoute>} />
          <Route path="/administrationrecord" element={<SuperAdminRoute ><AdministrationRecord /></SuperAdminRoute>} />
          <Route path="/administrationrecorddetail/:id" element={<SuperAdminRoute ><AdministrationRecordDetail /></SuperAdminRoute>} />
          <Route path="/register" element={<SuperAdminRoute ><Register /></SuperAdminRoute>} />
          <Route path="/allusers" element={<SuperAdminRoute ><AllUsers /></SuperAdminRoute>} />
          <Route path="/addproperty" element={<SuperAdminRoute ><AddProperty /></SuperAdminRoute>} />
          <Route path="/addfloor" element={<SuperAdminRoute ><AddFloor /></SuperAdminRoute>} />
          <Route path="/addunit" element={<SuperAdminRoute ><AddUnit /></SuperAdminRoute>} />
          <Route path="/addtenant" element={<SuperAdminRoute ><AddTenantForm /></SuperAdminRoute>} />
          <Route path="/allproperties" element={<SuperAdminRoute ><AllProperties /></SuperAdminRoute>} />
          <Route path="/singleproperty/:id" element={<SuperAdminRoute ><PropertyDetails /></SuperAdminRoute>} />
          <Route path="/alltenant" element={<SuperAdminRoute ><AllTenants /></SuperAdminRoute>} />
          <Route path="/tenantdetails/:id" element={<SuperAdminRoute ><TenantDetails /></SuperAdminRoute>} />
          <Route path="/superadmindashboard" element={<SuperAdminRoute ><SuperAdminDashboard /></SuperAdminRoute>} />
          <Route path="/pdc" element={<SuperAdminRoute ><PDC /></SuperAdminRoute>} />
          <Route path="/bank" element={<SuperAdminRoute ><Bank /></SuperAdminRoute>} />
          <Route path="/cash" element={<SuperAdminRoute ><Cash /></SuperAdminRoute>} />
          <Route path="/staticdata" element={<SuperAdminRoute ><StaticTenantData /></SuperAdminRoute>} />
          <Route path="/profile" element={<SuperAdminRoute ><Profile /></SuperAdminRoute>} />




          {/* Admin Routes */}
          <Route path="/admindashboard" element={<AdminRoute ><AdminDashboard /></AdminRoute>} />
          <Route path="/registerofadmin" element={<AdminRoute ><RegisterofAdmin /></AdminRoute>} />
          <Route path="/allusersofadmin" element={<AdminRoute ><AllUsersofAdmin /></AdminRoute>} />
          <Route path="/addpropertyofadmin" element={<AdminRoute ><AdminAddProperty /></AdminRoute>} />
          <Route path="/allpropertiesofadmin" element={<AdminRoute ><AllPropertiesForAdmin /></AdminRoute>} />
          <Route path="/singlepropertyforadmin/:id" element={<AdminRoute ><PropertyDetailsForAdmin /></AdminRoute>} />
          <Route path="/adminpdc" element={<AdminRoute ><Adminpdc /></AdminRoute>} />
          <Route path="/cashofadmin" element={<AdminRoute ><Admincash /></AdminRoute>} />
          <Route path="/bankofadmin" element={<AdminRoute ><Adminbank /></AdminRoute>} />
          <Route path="/addunitofadmin" element={<AdminRoute ><Adminunitsection /></AdminRoute>} />
          <Route path="/addfloorofadmin" element={<AdminRoute ><Adminfloor /></AdminRoute>} />
          <Route path="/addadmintenant" element={<AdminRoute ><AddAdminTenants /></AdminRoute>} />
          <Route path="/alltenantofadmin" element={<AdminRoute ><Admintenants /></AdminRoute>} />
          <Route path="/tenantdetailsofadmin/:id" element={<AdminRoute ><TenantDetailsofAdmin /></AdminRoute>} />
          <Route path="/addmaintenancecostofadmin" element={<AdminRoute ><Adminmaintaincecost /></AdminRoute>} />
          <Route path="/maintaincecostofadmin" element={<AdminRoute ><Adminmaintaincerecord /></AdminRoute>} />
          <Route path="/addadministrationfeeforadmin" element={<AdminRoute ><AddAdministrationFeeforAdmin /></AdminRoute>} />
          <Route path="/administrationrecordforadmin" element={<AdminRoute ><AdministrationRecordForAdmin /></AdminRoute>} />
          <Route path="/staticdenantdataforadmin" element={<AdminRoute ><StaticTenantDataforAdmin /></AdminRoute>} />
          <Route path="/administrationrecorddetailforadmin/:id" element={<AdminRoute ><AdministrationRecordDetailforAdmin /></AdminRoute>} />
          <Route path="/finicialreportforadmin" element={<AdminRoute ><FinancialReportForAdmin /></AdminRoute>} />


          {/* Owner Routes */}
          <Route path="/ownerdashboard" element={<OwnerRoute ><OwnerDashboard /></OwnerRoute>} />
          <Route path="/myproperties" element={<OwnerRoute ><MyProperties /></OwnerRoute>} />
          <Route path="/ownerpropertiesdetails/:id" element={<OwnerRoute ><OwnerPropertyDetails /></OwnerRoute>} />
          <Route path="/alltenatsforowners" element={<OwnerRoute ><AllTenantsForOwner /></OwnerRoute>} />
          <Route path="/tenantdetailsforowner/:id" element={<OwnerRoute ><TenantDetailsForOwner /></OwnerRoute>} />
          <Route path="/maintenanceforowner" element={<OwnerRoute ><MaintenanceForOwner /></OwnerRoute>} />
          <Route path="/allownerpdc" element={<OwnerRoute ><OwnerPdc /></OwnerRoute>} />
          <Route path="/staticdataforowner" element={<OwnerRoute ><StaticTenantDataforOwner /></OwnerRoute>} />
          <Route path="/mybank" element={<OwnerRoute ><OwnerBank /></OwnerRoute>} />
          <Route path="/mycash" element={<OwnerRoute ><OwnerCash /></OwnerRoute>} />


          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;


