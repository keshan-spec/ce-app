import Link from "next/link";

export const PostNotFound: React.FC = () => {
    return (
        <div className="w-full flex flex-col items-center mt-12 max-w-xs justify-center mx-auto">
            <h1 className="text-3xl text-center w-full">Oops! Post not found</h1>
            <p className="text-center w-full">The post you are looking for does not exist or has been removed.</p>
            <Link href="/posts">
                Back to posts
            </Link>
        </div>
    );
};