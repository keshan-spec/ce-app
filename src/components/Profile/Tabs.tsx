import { Feed } from './Sections/Feed';
import { Garage } from './Sections/Garage';
import { Bookmarks } from './Sections/Bookmarks';
import { Tags } from './Sections/Tags';

export const Tabs: React.FC = () => {
    return (
        <>
            <div className="section full">
                <div className="wide-block transparent p-0">
                    <ul className="nav nav-tabs lined iconed" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-bs-toggle="tab" href="#garage" role="tab">
                                Garage
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#feed" role="tab">
                                Posts
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#tagged-posts" role="tab">
                                Tagged
                            </a>
                        </li>
                        {/* <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#bookmarks" role="tab">
                                Bookmarks
                            </a>
                        </li> 
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#settings" role="tab">
                                <ion-icon name="settings-outline" role="img" className="md hydrated" aria-label="settings outline"></ion-icon>
                            </a>
                        </li> */}
                    </ul>
                </div>
            </div>


            <div className="section full mb-2">
                <div className="tab-content">
                    <Garage />
                    <Feed />
                    <Tags />
                    {/* <Bookmarks /> */}
                </div>
            </div>
        </>
    );
};