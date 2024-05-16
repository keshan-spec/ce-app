'use client';
import { handleSignIn, handleSignUp } from "@/actions/auth-actions";
import { Button } from "@/shared/Button";
import { ErrorMessage } from "@/shared/ErrorMessage";
import { IonIcon } from "@ionic/react";
import { chevronBackOutline, closeCircle } from "ionicons/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
    const [error, setError] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setError("");
        }, 3000);
    }, [error]);

    const handleSubmit = async (formData: FormData) => {
        try {
            const rawFormData = {
                full_name: formData.get("name")?.toString(),
                email: formData.get("email")?.toString(),
                password: formData.get("password")?.toString(),
            };

            // validation
            if (!rawFormData.full_name) {
                setError("Full name is required");
                return;
            }

            if (!rawFormData.email) {
                setError("Email is required");
                return;
            }

            if (!rawFormData.password) {
                setError("Password is required");
                return;
            }

            if (rawFormData.password !== formData.get("password2")?.toString()) {
                setError("Passwords do not match");
                return;
            }

            if (rawFormData.email && rawFormData.password && rawFormData.full_name) {
                setError("");

                const response = await handleSignUp(rawFormData);

                if (response?.error) {
                    setError(response.error);
                    return;
                }
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between px-3 my-3">
                <div className="left">
                    <Link href="/auth/login" className="text-xl text-black">
                        <IonIcon icon={chevronBackOutline} role="img" className="md hydrated" aria-label="chevron back outline" />
                    </Link>
                </div>
                <div className="pageTitle"></div>
                <div className="right">
                    <Link href="/auth/login" className="text-black">
                        Login
                    </Link>
                </div>
            </div>

            <div className="login-form">
                <div className="section">
                    <h1>Register</h1>
                    <h4>Fill the form to join us</h4>
                </div>
                <div className="section mt-2 mb-5">
                    <form action={handleSubmit}>
                        <div className="form-group boxed">
                            <div className="input-wrapper">
                                <input type="text" className="form-control" name="name" placeholder="Full name" />
                                <i className="clear-input">
                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                </i>
                            </div>
                        </div>

                        <div className="form-group boxed">
                            <div className="input-wrapper">
                                <input type="email" className="form-control" name="email" placeholder="Email address" />
                                <i className="clear-input">
                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                </i>
                            </div>
                        </div>

                        <div className="form-group boxed">
                            <div className="input-wrapper">
                                <input type="password" className="form-control" name="password" autoComplete="off" placeholder="Password" />
                                <i className="clear-input">
                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                </i>
                            </div>
                        </div>

                        <div className="form-group boxed">
                            <div className="input-wrapper">
                                <input type="password" className="form-control" name="password2" autoComplete="off" placeholder="Password (again)" />
                                <i className="clear-input">
                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                </i>
                            </div>
                        </div>

                        <div className=" mt-1 text-start">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="customCheckb1" />
                                <label className="form-check-label" htmlFor="customCheckb1">
                                    I Agree <a href="#">Terms &amp; Conditions</a></label>
                            </div>

                        </div>

                        <ErrorMessage message={error} />

                        <div className="form-button-group">
                            <Button type="submit">
                                Register
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;