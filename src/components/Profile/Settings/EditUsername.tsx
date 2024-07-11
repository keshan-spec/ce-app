'use client';
import { IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import React from 'react';

export const EditUsername: React.FC = () => {
    return (
        <div className="section full mt-2 mb-2">
            <div className="section-title">Change Username</div>
            <div className="wide-block pb-1 pt-1">
                <div className="form-group basic">
                    <div className="input-wrapper">
                        <label className="form-label" htmlFor="name1">Username</label>
                        <input type="text" className="form-control" id="name1" placeholder="Enter desired username" />
                        <i className="clear-input">
                            <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                        </i>
                    </div>
                    <div className="input-info">Your username can be changed every 30 days</div>
                </div>
            </div>
        </div>
    );
};