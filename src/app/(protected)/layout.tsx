import { GeneralErrorPopUp } from "@/shared/GeneralErrorPopUp";
import MainLayout from "../layouts/MainLayout";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <MainLayout>
            <GeneralErrorPopUp />
            {children}
        </MainLayout>
    );
}
