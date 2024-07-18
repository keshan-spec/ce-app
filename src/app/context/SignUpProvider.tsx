import React, { createContext, useState, ReactNode, useContext, useCallback, useEffect } from 'react';
import { RegisterCompleteSection, RegisterSection, UserNameSection } from '../auth/register/Steps';

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
    signUp: (user: NewUser) => void;
    setStep: (step: Step) => void;
}

// Create context with default values
const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

// Provider component
const SignUpProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
    const [user, setUser] = useState<NewUser | null>(null);
    const [step, setStep] = useState<Step>('register');
    const signUp = (user: NewUser) => setUser(user);

    return (
        <SignUpContext.Provider
            value={{
                user,
                step,
                signUp,
                setStep,
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
