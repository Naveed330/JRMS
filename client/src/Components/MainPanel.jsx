import React from 'react'

const MainPanel = () => {
    return (
        <>

            <div class="main-panel mt-5"  >
                <div class="content-wrapper mt-5">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home" />
                            </span>{' '}
                            Dashboard
                        </h3>
                        <nav aria-label="breadcrumb">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item active" aria-current="page">
                                    <span />
                                    Overview{' '}
                                    <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle" />
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="row">
                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-danger card-img-holder text-white">
                                <div className="card-body">
                                    <img
                                        src="assets/images/dashboard/circle.svg"
                                        className="card-img-absolute"
                                        alt="circle-image"
                                    />
                                    <h4 className="font-weight-normal mb-3">
                                        Weekly Sales <i className="mdi mdi-chart-line mdi-24px float-right" />
                                    </h4>
                                    <h2 className="mb-5">$ 15,0000</h2>
                                    <h6 className="card-text">Increased by 60%</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-info card-img-holder text-white">
                                <div className="card-body">
                                    <img
                                        src="assets/images/dashboard/circle.svg"
                                        className="card-img-absolute"
                                        alt="circle-image"
                                    />
                                    <h4 className="font-weight-normal mb-3">
                                        Weekly Orders{' '}
                                        <i className="mdi mdi-bookmark-outline mdi-24px float-right" />
                                    </h4>
                                    <h2 className="mb-5">45,6334</h2>
                                    <h6 className="card-text">Decreased by 10%</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-success card-img-holder text-white">
                                <div className="card-body">
                                    <img
                                        src="assets/images/dashboard/circle.svg"
                                        className="card-img-absolute"
                                        alt="circle-image"
                                    />
                                    <h4 className="font-weight-normal mb-3">
                                        Visitors Online <i className="mdi mdi-diamond mdi-24px float-right" />
                                    </h4>
                                    <h2 className="mb-5">95,5741</h2>
                                    <h6 className="card-text">Increased by 5%</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default MainPanel
