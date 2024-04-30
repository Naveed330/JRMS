import OwnerSideBar from '../../Components/OwnerSideBar';
import OwnerMainPanel from '../../Components/OwnerMainPanel';
import OwnerPdcReport from '../../Components/OwnerPdcReport';
import OwnerBankReport from '../../Components/OwnerBankReport';

const OwnerDashboard = () => {
  return (
    <>
      <div className="container-fluid page-body-wrapper">
          <OwnerSideBar />

          <OwnerMainPanel />
        </div>

      {/* <OwnerPdcReport />

      <OwnerBankReport /> */}


    </>
  );
}

export default OwnerDashboard;
