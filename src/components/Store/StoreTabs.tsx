import Link from "next/link";
import { Products } from "./Products";

export const StoreTabs: React.FC = () => {
    return (
        <div className="section full">
            <div className="home-tabs-wrapper">
                <div className="tab-content">
                    <Products />

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