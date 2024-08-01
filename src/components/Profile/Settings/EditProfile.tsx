'use client';
import { updatePassword, updateUserDetails } from '@/actions/auth-actions';
import { useUser } from '@/hooks/useUser';
import { IonIcon } from '@ionic/react';
import { caretForwardOutline, closeCircle } from 'ionicons/icons';
import React, { memo, useEffect, useRef, useState } from 'react';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { PasswordForm, passwordSchema, UserDetailsForm, userDetailsSchema } from '@/zod-schemas/profile';

const EditProfile = () => {
    const { user, isLoggedIn } = useUser();

    if (!isLoggedIn || !user) return null;

    return (
        <div className="section full mt-1 mb-2">
            <UserDetails />
            <UpdatePasswordForm />
        </div>
    );
};

const UserDetails: React.FC = () => {
    const { user } = useUser(); // Assuming useUser() provides user details

    const { register, handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting, isSubmitSuccessful, isDirty, dirtyFields } } = useForm<UserDetailsForm>({
        resolver: zodResolver(userDetailsSchema),
        defaultValues: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        }
    });

    const onSubmit: SubmitHandler<UserDetailsForm> = async (data) => {
        const previous_email = user.email;
        let mailChanged = false;

        if (dirtyFields.email) {
            mailChanged = previous_email !== data.email;
        }

        try {
            const response = await updateUserDetails(data, mailChanged);
            if (response && response.success) {
                reset(data);
                return;
            }

            throw new Error(response.message);

        } catch (error: any) {
            setError("root", { message: error.message });

        }
    };

    return (
        <div className="section full mt-2 mb-2">
            <div className="section-title">Your Details</div>
            <div className="wide-block pb-1 pt-1">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label" htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                placeholder="Enter first name"
                                {...register("first_name")}
                            />
                            <i className="clear-input">
                                <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                            </i>
                            {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}
                        </div>
                    </div>

                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label" htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                placeholder="Enter last name"
                                {...register("last_name")}
                            />
                            <i className="clear-input">
                                <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                            </i>
                            {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}
                        </div>
                    </div>

                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label" htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="E-mail address"
                                {...register("email")}
                            />
                            <i className="clear-input">
                                <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                            </i>
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mb-2" disabled={isSubmitting || !isDirty}>
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                </form>

                <div id="toast-16" className={clsx(
                    "toast-box toast-top",
                    { "bg-success": isSubmitSuccessful },
                    { "bg-danger": errors.root },
                    { "show": isSubmitSuccessful || errors.root }
                )}>
                    <div className="in">
                        <div className="text">
                            {errors.root && errors.root.message}
                            {isSubmitSuccessful && "Password updated successfully"}
                        </div>
                    </div>
                    <button type="button" className="btn btn-sm btn-text-light close-button"
                        onClick={() => {
                            if (isSubmitSuccessful) {
                            } else {
                                clearErrors();
                            }
                        }}
                    >OK</button>
                </div>
            </div>
        </div>
    );
};

const UpdatePasswordForm: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema)
    });

    const onSubmit: SubmitHandler<PasswordForm> = async (data) => {
        try {
            const response = await updatePassword(data.newPassword, data.currentPassword);
            if (response && response.success) {
                reset();
                return;
            }

            throw new Error(response.message);
        } catch (error: any) {
            setError("root", { message: error.message });
        }
    };

    return (
        <div className="section full mt-2 mb-5">
            <div className="section-title">Password</div>
            <div className="wide-block pb-1 pt-1">
                <div className="change-pass-toggle" onClick={() => setShowForm(!showForm)}>
                    Change Password
                    <IonIcon icon={caretForwardOutline} role="img" className="md hydrated" aria-label="caret forward outline" />
                </div>
                {showForm && (
                    <form className="mt-3 collapse-password-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="currentPassword" className="form-label">Current Password</label>
                            <input
                                type="password"
                                className={clsx(
                                    "form-control",
                                    { "invalid-field-border": errors.currentPassword }
                                )}
                                id="currentPassword"
                                placeholder='Current Password'
                                {...register("currentPassword")}
                            />
                            {errors.currentPassword && (
                                <div className="error-message">{errors.currentPassword.message}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className={clsx(
                                    "form-control",
                                    { "invalid-field-border": errors.newPassword }
                                )}
                                placeholder='New Password'
                                {...register("newPassword")}
                            />
                            {errors.newPassword && (
                                <div className="error-message">{errors.newPassword.message}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className={clsx(
                                    "form-control",
                                    { "invalid-field-border": errors.confirmPassword }
                                )}
                                placeholder='Confirm Password'
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <div className="error-message">{errors.confirmPassword.message}</div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary mb-2" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update Password"}</button>
                    </form>
                )}

                <div id="toast-16" className={clsx(
                    "toast-box toast-top",
                    { "bg-success": isSubmitSuccessful },
                    { "bg-danger": errors.root },
                    { "show": isSubmitSuccessful || errors.root }
                )}>
                    <div className="in">
                        <div className="text">
                            {errors.root && errors.root.message}
                            {isSubmitSuccessful && "Password updated successfully"}
                        </div>
                    </div>
                    <button type="button" className="btn btn-sm btn-text-light close-button"
                        onClick={() => {
                            if (isSubmitSuccessful) {
                                setShowForm(false);
                            } else {
                                clearErrors();
                            }
                        }}
                    >OK</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditProfile);