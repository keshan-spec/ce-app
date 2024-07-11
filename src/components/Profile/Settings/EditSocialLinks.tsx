'use client';
import { useUser } from '@/hooks/useUser';
import { IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import React from 'react';

export const EditSocialLinks: React.FC = () => {
    const { user, isLoggedIn } = useUser();

    if (!isLoggedIn || !user) return null;

    return (
        <>
            <div className="section full mt-2 mb-2">
                <div className="section-title">Social Links</div>
                <div className="wide-block pb-1 pt-1">

                    <div className="form-group basic horizontal">
                        <div className="input-wrapper">
                            <div className="row align-items-center">

                                <div className="col-3 mb-2"><label>Instagram</label></div>
                                <div className="col-9 mb-2">
                                    <div className="input-wrapper">
                                        <label className="form-label"></label>
                                        <input type="text" className="form-control" placeholder="Instagram Username" defaultValue={user.profile_links.instagram} />
                                        <i className="clear-input">
                                            <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                        </i>
                                    </div>
                                </div>
                                <div className="col-3 mb-2"><label>Facebook</label></div>
                                <div className="col-9 mb-2">
                                    <div className="input-wrapper">
                                        <label className="form-label"></label>
                                        <input type="text" className="form-control" placeholder="Facebook Username" defaultValue={user.profile_links.facebook} />
                                        <i className="clear-input">
                                            <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                        </i>
                                    </div>
                                </div>

                                <div className="col-3 mb-2"><label>TikTok</label></div>
                                <div className="col-9 mb-2">
                                    <div className="input-wrapper">
                                        <label className="form-label"></label>
                                        <input type="text" className="form-control" placeholder="TikTok Username" defaultValue={user.profile_links.tiktok} />
                                        <i className="clear-input">
                                            <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                        </i>
                                    </div>
                                </div>
                                <div className="col-3 mb-2"><label>YouTube</label></div>
                                <div className="col-9 mb-2">
                                    <div className="input-wrapper">
                                        <label className="form-label"></label>
                                        <input type="text" className="form-control" placeholder="YouTube Username" defaultValue={user.profile_links.youtube} />
                                        <i className="clear-input">
                                            <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                        </i>
                                    </div>
                                </div>

                                <div className="col-3 mb-2"><label>Custodian</label></div>
                                <div className="col-9 mb-2">
                                    <div className="input-wrapper">
                                        <label className="form-label"></label>
                                        <input type="text" className="form-control" placeholder="Custodian Username" defaultValue={user.profile_links.custodian} />
                                        <i className="clear-input">
                                            <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                        </i>
                                    </div>
                                </div>

                                <div className="col-3 mb-2"><label>Mivia</label></div>
                                <div className="col-9 mb-2">
                                    <div className="input-wrapper">
                                        <label className="form-label"></label>
                                        <input type="text" className="form-control" placeholder="Mivia Username" defaultValue={user.profile_links.mivia} />
                                        <i className="clear-input">
                                            <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                        </i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section full mt-2 mb-2">
                <div className="section-title">Custom links</div>
                <div className="wide-block pb-1 pt-0">
                    {user.profile_links.links?.length > 0 ? (
                        <ul className="listview simple-listview mb-2 border-top-0">
                            {user.profile_links.links?.map((link, i) => (
                                <li className="pl-0" key={i}>
                                    {link.label}
                                    <span>
                                        <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-4">No custom links added</div>
                    )}

                    <button type="button" className="btn btn-primary btn-block" data-bs-toggle="offcanvas" data-bs-target="#addlinkSheet">+ Add</button>
                    <AddLinkSheet />
                </div>
            </div>
        </>
    );
};

const AddLinkSheet: React.FC = () => {
    return (
        <div className="offcanvas offcanvas-bottom action-sheet" tabIndex={-1} id="addlinkSheet" style={{
            visibility: 'visible'
        }} aria-modal="true" role="dialog">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Add Custom Link</h5>
            </div>
            <div className="offcanvas-body">
                <div className="action-sheet-content">
                    <form>
                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="form-label" htmlFor="name3">Link Title</label>
                                <input type="text" className="form-control" id="name3" placeholder="E.g. Our Website" />
                                <i className="clear-input">
                                    <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />

                                </i>
                            </div>
                        </div>

                        <div className="form-group basic">
                            <div className="input-wrapper">
                                <label className="form-label" htmlFor="name3">Link URL </label>
                                <input type="text" className="form-control" id="name3" placeholder="E.g https://www.mylink.com" />
                                <i className="clear-input">
                                    <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />

                                </i>
                            </div>
                            <div className="input-info">Including https://</div>
                        </div>

                        <div className="form-group basic">
                            <button type="button" className="btn btn-primary btn-block" data-bs-dismiss="offcanvas">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};