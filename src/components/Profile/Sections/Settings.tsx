const Settings: React.FC = () => {
    return (
        <div className="fade show" id="settings" role="tabpanel">
            <ul className="listview image-listview text flush transparent pt-1">
                <li>
                    <div className="item">
                        <div className="in">
                            <div>
                                Mute
                                <footer>Disabled notifications from this person</footer>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="SwitchCheckDefault1" />
                                <label className="form-check-label" htmlFor="SwitchCheckDefault1"></label>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <a href="#" className="item">
                        <div className="in">
                            <div className="text-danger">Block</div>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#" className="item">
                        <div className="in">
                            <div>Report</div>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#" className="item">
                        <div className="in">
                            <div>Share This Profile</div>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#" className="item">
                        <div className="in">
                            <div>Send a Message</div>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#" className="item">
                        <div className="in">
                            <div>Add to List</div>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#" className="item">
                        <div className="in">
                            <div>About</div>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="#" className="item">
                        <div className="in">
                            <div>Ignore</div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Settings;