'use client';
import { RegisterForm, SignUpProvider } from "@/app/context/SignUpProvider";

const Page: React.FC = () => {
    return (
        <SignUpProvider>
            <RegisterForm />
        </SignUpProvider>
    );
};

export default Page;