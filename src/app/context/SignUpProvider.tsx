import React, { createContext, useState, ReactNode, useContext, useCallback, useEffect } from 'react';
import { RegisterCompleteSection, RegisterSection, UserNameSection } from '../auth/register/Steps';
import { handleSignIn } from '@/actions/auth-actions';

export interface NewUser {
    user_id?: number;
    username?: string;
    email: string;
    full_name: string;
    password: string;
}

type Step = 'register' | 'username' | 'complete';

interface SignUpContextType {
    user: NewUser | null;
    step: Step;
    error: string;
    signUp: (user: NewUser) => void;
    setStep: (step: Step) => void;
    setError: (error: string) => void;
}

// Create context with default values
const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

// Provider component
const SignUpProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
    const [user, setUser] = useState<NewUser | null>(null);
    const [step, setStep] = useState<Step>('register');
    const [error, setError] = useState<string>('');
    const signUp = (user: NewUser) => setUser(user);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    }, [error]);

    return (
        <SignUpContext.Provider
            value={{
                user,
                step,
                error,
                signUp,
                setStep,
                setError
            }}
        >
            {children}
        </SignUpContext.Provider>
    );
};

const useSignUp = () => {
    const context = useContext(SignUpContext);

    if (context === undefined) {
        throw new Error('useSignUp must be used within an SignUpProvider');
    }
    return context;
};

const RegisterForm = () => {
    const { step } = useSignUp();

    const renderStep = useCallback(() => {
        switch (step) {
            case 'username':
                return <UserNameSection />;
            case 'complete':
                return <RegisterCompleteSection />;
            default:
                return <RegisterSection />;
        }
    }, [step]);

    return (
        <>
            {renderStep()}
        </>
    );
};

export { SignUpProvider, useSignUp, RegisterForm };
