import Link from "next/link";

const Page = () => {
    return (
        <div className="text-center px-4 flex flex-col justify-center items-center h-screen w-full">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for might not exist or is temporarily unavailable.</p>
            <Link href="/">
                Go back to the homepage
            </Link>
        </div>
    );
};

export default Page;