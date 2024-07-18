'use client';
import { updateUsername } from '@/actions/auth-actions';
import { useUser } from '@/hooks/useUser';
import { UsernameFormValues, usernameSchema } from '@/zod-schemas/register-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IonIcon } from '@ionic/react';
import clsx from 'clsx';
import { closeCircleOutline } from 'ionicons/icons';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';


export const EditUsername: React.FC = () => {
    const { user, isLoggedIn } = useUser();

    const { register, handleSubmit, reset, setError, formState: { errors, isDirty, isSubmitting } } = useForm<UsernameFormValues>({
        resolver: zodResolver(usernameSchema),
        defaultValues: { username: user?.username || '' }
    });

    const onSubmit: SubmitHandler<UsernameFormValues> = async (data) => {
        try {
            const response = await updateUsername({
                user_id: user?.id,
                username: data.username
            });

            if (response && response.success) {
                reset({ username: response.username });
                return;
            }

            throw new Error(response.message);
        } catch (error: any) {
            setError("root", {
                message:
                    error.message || "Something went wrong. Please try again later."
            });
        }
    };

    if (!isLoggedIn || !user) return null;

    return (
        <div className="section full mt-2 mb-2">
            <div className="section-title">Change Username</div>
            <div className="wide-block pb-1 pt-1">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label" htmlFor="username">Username</label>
                            <input
                                type="text"
                                className={clsx(
                                    "form-control",
                                    errors.username && "!border-b !border-red-600"
                                )}
                                id="username"
                                disabled={!user.can_update_username}
                                placeholder="Enter desired username"
                                {...register("username")}
                            />
                            <i className="clear-input">
                                <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                            </i>
                            {errors.username && (
                                <div className="text-xs text-red-600 mt-1">{errors.username.message}</div>
                            )}
                        </div>
                        {errors.root && (
                            <div className="text-xs text-red-600 mt-1">{errors.root.message}</div>
                        )}
                        <div className="input-info">Your username can be changed every 30 days</div>
                    </div>
                    <div className="form-group basic">
                        <button type="submit" className="btn btn-primary btn-block" disabled={!isDirty || isSubmitting || !user.can_update_username}>
                            {!user.can_update_username ? (
                                `You can change your username again in ${user.next_update_username} days`
                            ) : isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};