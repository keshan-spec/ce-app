import React from 'react';

const Bookmarks: React.FC = () => {
    return (
        <div className="tab-pane fade" id="bookmarks" role="tabpanel">
            <ul className="listview image-listview media flush transparent pt-1">
                <li>
                    <a href="#" className="item">
                        <div className="imageWrapper">
                            <img src="assets/img/sample/photo/1.jpg" alt="image" className="imaged w64" />
                        </div>
                        <div className="in">
                            <div>
                                Birds
                                <div className="text-muted">62 photos</div>
                            </div>
                            <span className="badge badge-primary">5</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Bookmarks;