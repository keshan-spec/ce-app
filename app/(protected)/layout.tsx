import MainLayout from "../layouts/MainLayout";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
