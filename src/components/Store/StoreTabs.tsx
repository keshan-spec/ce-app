import Link from "next/link";

export const StoreTabs: React.FC = () => {
    return (
        <div className="section full">
            <div className="home-tabs-wrapper">
                <div className="tab-content">
                    <div className="tab-pane fade active show" id="panels-tab1" role="tabpanel">
                        <div className="section mt-2">
                            <div className="row">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div className="col-6 mb-3" key={i}>
                                        <div className="card product-card" data-location="store-product.php">
                                            <div className="card-body">
                                                <div className="card-img-box" style={{
                                                    backgroundImage: "url('assets/img/sample/photo/product1.jpg')",
                                                }}></div>
                                                <h2 className="title">DriveLife QR Code</h2>
                                                <p className="text">Circle</p>
                                                <div className="price">£4.50</div>
                                                <Link
                                                    href={`/store/product/${i}`}
                                                    className="btn btn-sm btn-primary btn-block">View</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="panels-tab2" role="tabpanel">
                        <div className="section mt-2">
                            <div className="row">

                                <div className="wide-block p-0">

                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Order</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">#001</th>
                                                    <td>01/01/2024</td>
                                                    <td>Mark Smith</td>
                                                    <td>Dispatched</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};