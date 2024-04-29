"use client";

import { handleSignOut } from "@/actions/auth-actions";
import { useState } from "react";
import Modal from "./Modal";

export const SignOutBtn: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const onClick = () => {
        setShowModal(!showModal);
    };

    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="p-5 text-black bg-slate-50 rounded-lg">
                    <h1 className="text-lg font-bold text-center">Are you sure you want to sign out?</h1>
                    <div className="flex justify-center gap-3 mt-5">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
                            onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm"
                            onClick={() => handleSignOut()}>
                            Sign out
                        </button>
                    </div>
                </div>
            </Modal>

            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => onClick()}>
                Sign out
            </button>
        </>
    );
};