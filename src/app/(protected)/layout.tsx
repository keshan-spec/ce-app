import dynamic from "next/dynamic";

const MainLayout = dynamic(() => import('@/app/layouts/MainLayout'), { ssr: false });
const GeneralErrorPopUp = dynamic(() => import('@/shared/GeneralErrorPopUp'), { ssr: false });

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
