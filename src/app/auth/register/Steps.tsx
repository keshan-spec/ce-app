'use client';

import { Options } from "@splidejs/splide";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Link from "next/link";
import '@splidejs/react-splide/css';
import { IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import React, { useCallback, useEffect, useState } from "react";
import { Wrapper } from "../Wrapper";
import { handleSignIn, handleSignUp, updateUsername } from "@/actions/auth-actions";
import { ErrorMessage } from "@/shared/ErrorMessage";
import { Button } from "@/shared/Button";
import { useSignUp } from "@/app/context/SignUpProvider";
import clsx from "clsx";
import { InputField } from "@/shared/Input";

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

const generateUsername = (full_name: string) => {
    const first = full_name.split(" ")[0].toLowerCase();
    const last_char = full_name.split(" ")[1].charAt(0).toLowerCase();

    const randomNum = Math.floor(Math.random() * 10000);

    return `${first}.${last_char}${randomNum}`;
};


export const UserNameSection = () => {
    const {
        setStep,
        error,
        setError,
        user,
    } = useSignUp();

    const handleSubmit = async (formData: FormData) => {
        console.log("User", user);

        try {
            if (!user?.user_id) {
                setError("User ID is missing, please try the process again.");
                return;
            }

            setError("");

            const username = formData.get("username")?.toString();

            if (username === user?.username) {
                setStep("complete");
                return;
            }

            if (!username) {
                setError("Username is required");
                return;
            }

            // validation
            if (username.length < 3) {
                setError("Username must be at least 3 characters");
                return;
            }

            if (username.length > 20) {
                setError("Username must be less than 20 characters");
                return;
            }

            const response = await updateUsername({
                user_id: user.user_id,
                username,
            });

            if (!response || !response.success) {
                setError(response?.message || "Something went wrong");
                return;
            }

            setStep("complete");
        } catch (error: any) {
            setError(error.message);
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
                    <form action={handleSubmit}>
                        <InputField type="text" name="username" placeholder="Username" className="text-center" error={error} defaultValue={user?.username} />

                        <div className="form-button-group">
                            <Button type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </div>
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
    const { error, setError, setStep, signUp } = useSignUp();
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const resetErrors = () => {
        setError("");
        setNameError("");
        setEmailError("");
        setPasswordError("");
    };


    const handleSubmit = async (formData: FormData) => {
        resetErrors();

        let hasError = false;

        try {
            const rawFormData = {
                full_name: formData.get("name")?.toString(),
                email: formData.get("email")?.toString(),
                password: formData.get("password")?.toString(),
                terms: formData.get("terms")?.toString(),
            };

            // validation
            if (!rawFormData.full_name) {
                setNameError("Full name is required");
                hasError = true;
            }

            if (!rawFormData.email) {
                setEmailError("Email is required");
                hasError = true;
            }

            if (!rawFormData.password) {
                setPasswordError("Password is required");
                hasError = true;
            }

            if (rawFormData.password !== formData.get("password2")?.toString()) {
                setPasswordError("Passwords do not match");
                hasError = true;
            }

            if (hasError) {
                return;
            }

            if (rawFormData.email && rawFormData.password && rawFormData.full_name) {
                if (rawFormData.terms !== "on") {
                    setError("You must agree to the terms and conditions");
                    return;
                }

                const response = await handleSignUp({
                    email: rawFormData.email,
                    full_name: rawFormData.full_name,
                    password: rawFormData.password,
                });

                if (!response || !response.success) {
                    switch (response?.code) {
                        case "email_exists":
                            setEmailError("Email already exists");
                            break;
                        case "username_exists":
                            setError("Username already exists");
                            break;
                        default:
                            setError(response?.message || "Something went wrong");
                            break;
                    }

                    return;
                }

                const username = response.username;

                signUp({
                    user_id: response.user_id,
                    email: rawFormData.email,
                    full_name: rawFormData.full_name,
                    password: rawFormData.password,
                    username,
                });

                setStep("username");
            }
        } catch (error: any) {
            setError(error.message);
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
                        <form action={handleSubmit}>
                            <InputField type="text" name="name" placeholder="Full name" error={nameError} />
                            <InputField type="email" name="email" placeholder="Email address" error={emailError} />
                            <InputField type="password" name="password" placeholder="Password" error={passwordError} />
                            <InputField type="password" name="password2" placeholder="Password (again)" error={passwordError} />

                            <div className="mt-1 text-start">
                                <div className="form-check">
                                    <input type="checkbox" name="terms" className="form-check-input" id="terms" />
                                    <label className="form-check-label" htmlFor="terms">
                                        I Agree to the <a href="#">Terms &amp; Conditions</a></label>
                                </div>
                            </div>

                            <ErrorMessage message={error} />

                            <div className="form-button-group">
                                <Button type="submit">
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};