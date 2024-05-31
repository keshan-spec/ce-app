'use client';
import { useEffect, useState } from "react";
import { Button } from "@/shared/Button";
import { handleSignIn } from "@/actions/auth-actions";
import { ErrorMessage } from "@/shared/ErrorMessage";
import { useSearchParams } from "next/navigation";
import { IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import Link from "next/link";
import { Wrapper } from "../Wrapper";

const Login = () => {
    const [error, setError] = useState("");

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    useEffect(() => {
        setTimeout(() => {
            setError("");
        }, 3000);
    }, [error]);

    const handleSubmit = async (formData: FormData) => {
        try {
            const rawFormData = {
                email: formData.get("email")?.toString(),
                password: formData.get("password")?.toString(),
                redirectTo: callbackUrl
            };

            // validation
            if (!rawFormData.email) {
                setError("Email is required");
                return;
            }

            if (!rawFormData.password) {
                setError("Password is required");
                return;
            }

            if (rawFormData.email && rawFormData.password) {
                setError("");

                const response = await handleSignIn(rawFormData);

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
        <Wrapper>
            <div id="appCapsule">
                <div className="login-form mt-1">
                    <div className="section mt-1">
                        <h1><img src="/assets/img/logo-icon1.png" />Get started</h1>
                        <h4>Log in below</h4>
                    </div>
                    <div className="section mt-1 mb-5">
                        <form action={handleSubmit}>
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
                                    <input type="password" className="form-control" name="password" placeholder="Password" autoComplete="off" />
                                    <i className="clear-input">
                                        <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                    </i>
                                </div>
                            </div>

                            <div className="form-links mt-2">
                                <div>
                                    <Link href="/auth/register">
                                        Register Now
                                    </Link>
                                </div>
                                {/* <div><a href="page-forgot-password.html" className="text-muted">Forgot Password?</a></div> */}
                            </div>

                            <ErrorMessage message={error} />

                            <div className="form-button-group">
                                <Button type="submit" >
                                    Log In
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>


            </div>
        </Wrapper>
    );
};

export default Login;