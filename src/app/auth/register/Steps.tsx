'use client';

import { Options } from "@splidejs/splide";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import React, { useCallback, useEffect, useState } from "react";
import { Wrapper } from "../Wrapper";
import { handleSignIn, handleSignUp, updateUsername } from "@/actions/auth-actions";
import { Button } from "@/shared/Button";
import { useSignUp } from "@/app/context/SignUpProvider";
import { InputField } from "@/shared/Input";
import { sendRNMessage } from "@/utils/nativeFeel";
import { registerFields, RegistrationFormValues, registrationSchema, UsernameFormValues, usernameSchema } from "@/zod-schemas/register-form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";

const carouselOptions: Options = {
    perPage: 1,
    rewind: false,
    type: "loop",
    gap: 16,
    padding: 16,
    arrows: false,
    pagination: true,
};

const getStartedData = [
    {
        title: "Add your garage",
        description: "Add your current and previous vehicles and allow other users to tag photos of your car using your vehicle registration",
        image: "/assets/img/start02.jpg"
    },
    {
        title: "Get your QR code",
        description: "Put a DriveLife QR code in your window to allow followers to find all of your socials, including Instagram and TikTok",
        image: "/assets/img/start03.jpg"
    },
    {
        title: "Follow & Explore",
        description: "Discover and follow other DriveLife users, events and venues around the country",
        image: "/assets/img/start04.jpg"
    }
];

export const UserNameSection = () => {
    const {
        setStep,
        // error,
        // setError,
        user,
    } = useSignUp();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<UsernameFormValues>({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: user?.username || "",
        },
    });

    const onSubmit: SubmitHandler<UsernameFormValues> = async (data) => {
        try {
            if (!user?.user_id) {
                setError("root", {
                    type: "manual",
                    message: "User ID is missing, please try the process again.",
                });
                return;
            }

            const username = data.username;

            if (username === user?.username) {
                setStep("complete");
                return;
            }

            const response = await updateUsername({
                user_id: user.user_id,
                username,
            });

            if (!response || !response.success) {
                switch (response?.code) {
                    case "username_exists":
                        setError("root", {
                            type: "manual",
                            message: "Username already exists",
                        });
                        break;
                    default:
                        setError("root", {
                            type: "manual",
                            message: response?.message || "Something went wrong",
                        });
                        break;
                }
                return;
            }

            setStep("complete");
        } catch (error: any) {
            setError("root", {
                type: "manual",
                message: error?.message || "An error occurred",
            });
        }
    };


    return (
        <div id="appCapsule">
            <div className="login-form">
                <div className="section">
                    <h1>Username</h1>
                    <h4>Set your DriveLife username</h4>
                </div>
                <div className="section mt-2 mb-5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group boxed">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className={clsx(
                                        "form-control",
                                        errors.username ? "!border-red-600" : ""
                                    )}
                                    {...register("username")}
                                />
                                <i className="clear-input">
                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                </i>
                            </div>
                            {errors.username && <div className="text-red-600 text-left text-xs mt-1">{errors.username.message}</div>}
                        </div>

                        <div className="form-button-group">
                            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                                {isSubmitting ? 'Loading...' : 'Continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div id="toast-16" className={clsx(
                "toast-box toast-top",
                { "bg-danger": errors.root },
                { "show": errors.root }
            )}>
                <div className="in">
                    <div className="text">
                        {errors.root && errors.root.message}
                    </div>
                </div>
                <button type="button" className="btn btn-sm btn-text-light close-button"
                    onClick={() => {
                        clearErrors();
                    }}
                >OK</button>
            </div>
        </div>
    );
};

export const RegisterCompleteSection = () => {
    const [step, setStep] = useState(1);

    const {
        user
    } = useSignUp();

    useEffect(() => {
        if (step === 3) {
            if (user?.user_id) {
                sendRNMessage({
                    type: "authData",
                    user_id: user.user_id,
                });

                handleSignIn({
                    email: user.email,
                    password: user.password,
                });
            }
        }
    }, [step, user]);

    const handleComplete = async () => {
        if (user?.user_id) {
            setStep(2);
        }
    };

    const renderStep = useCallback(() => {
        switch (step) {
            case 3:
            case 2:
                return (
                    <>
                        <Splide options={carouselOptions} className="text-center carousel-slider">
                            {getStartedData.map((data: any, idx) => (
                                <SplideSlide>
                                    <img src={data.image} alt={data.title} className="imaged w-100 square mb-4" />
                                    <h2><span>Next Steps</span>{data.title}</h2>
                                    <p>{data.description}</p>
                                </SplideSlide>
                            ))}
                        </Splide>

                        <div className="carousel-button-footer">
                            <div className="row">
                                <div className="col-12">
                                    <button onClick={() => {
                                        setStep(3);
                                    }} className="btn btn-primary btn-lg btn-block">
                                        Get Started
                                    </button>
                                    {/* <Link href="/" className="btn btn-primary btn-lg btn-block">Get Started</Link> */}
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 1:
            default:
                return (
                    <>
                        <div className="signup-welcome-panel">
                            <img src="/assets/img/start01.jpg" alt="alt" className="imaged w-100 square mb-4" />
                            <h2><span>Welcome</span>All done!</h2>
                            <p>Brought to you be CarEvents.com, DriveLife brings to you a world of car events, venues, news, media and more</p>
                        </div >

                        <div className="carousel-button-footer">
                            <div className="row">
                                <div className="col-12">
                                    <button onClick={() => {
                                        setStep(2);
                                    }} className="btn btn-primary btn-lg btn-block">Continue</button>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    }, [step]);


    return (
        <>
            <div className="appHeader scrolled header-div-wrapper">
                <div className="header-row-wrapper-top">
                    <div className="left">
                    </div>
                    <div className="header-logo"><img src="/assets/img/logo-dark.png" alt="" /></div>
                    <div className="right">
                    </div>
                </div>

            </div>

            <div id="appCapsule">
                {renderStep()}
            </div>
        </>
    );
};

export const RegisterSection = () => {
    const { setStep, signUp } = useSignUp();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
    });

    const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
        try {
            const response = await handleSignUp(data);

            if (!response || !response.success) {
                switch (response?.code) {
                    case "email_exists":
                        setError("root", {
                            type: "manual",
                            message: "Email already exists",
                        });
                        break;
                    case "username_exists":
                        setError("root", {
                            type: "manual",
                            message: "Username already exists",
                        });
                        break;
                    default:
                        setError("root", {
                            type: "manual",
                            message: response?.message || "Something went wrong",
                        });
                        break;
                }
                return;
            }

            const username = response.username;

            signUp({
                user_id: response.user_id,
                email: data.email,
                full_name: data.full_name,
                password: data.password,
                username,
            });
            setStep("username");
        } catch (error: any) {
            setError("root", {
                type: "manual",
                message: error?.message || "An error occurred",
            });
        }
    };

    return (
        <Wrapper>
            <div id="appCapsule">
                <div className="login-form">
                    <div className="section">
                        <h1>Register</h1>
                        <h4>Create your DriveLife Account</h4>
                    </div>
                    <div className="section mt-2 mb-5">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {registerFields.map((field) => (
                                <div className="form-group boxed" key={field.name}>
                                    <div className="input-wrapper">
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            {...register(field.name as keyof RegistrationFormValues)}
                                            className={clsx(
                                                "form-control",
                                                errors[field.name as keyof RegistrationFormValues] ? "!border-red-600" : ""
                                            )}
                                        />
                                        <i className="clear-input">
                                            <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                        </i>
                                    </div>
                                    {errors[field.name as keyof RegistrationFormValues] && <div className="text-red-600 text-left text-xs mt-1">{errors[field.name as keyof RegistrationFormValues]?.message}</div>}
                                </div>
                            ))}

                            {/* <InputField type="text" placeholder="Full name" error={errors.full_name?.message} {...register('full_name')} />
                            <InputField type="email" placeholder="Email address" error={errors.email?.message} {...register('email')} />
                            <InputField type="password" placeholder="Password" error={errors.password?.message} {...register('password')} />
                            <InputField type="password" placeholder="Password (again)" error={errors.password2?.message} {...register('password2')} /> */}

                            <div className="mt-1 text-start">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="terms" {...register('terms')} />
                                    <label className="form-check-label" htmlFor="terms">
                                        I Agree to the <a href="#">Terms &amp; Conditions</a>
                                    </label>
                                </div>
                                {errors.terms && <span className="text-danger text-xs">{errors.terms.message}</span>}
                            </div>

                            <div id="toast-16" className={clsx(
                                "toast-box toast-top",
                                { "bg-danger": errors.root },
                                { "show": errors.root }
                            )}>
                                <div className="in">
                                    <div className="text">
                                        {errors.root && errors.root.message}
                                    </div>
                                </div>
                                <button type="button" className="btn btn-sm btn-text-light close-button"
                                    onClick={() => {
                                        clearErrors();
                                    }}
                                >OK</button>
                            </div>

                            <div className="form-button-group">
                                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                                    {isSubmitting ? 'Loading...' : 'Continue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};