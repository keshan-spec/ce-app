"use client";

function PrivateMessage({ message }: { message: string; }) {
    return (
        <div className="mt-2 ml-2 rounded-md border bg-inherit px-3 py-2 text-sm text-darkgrayishblue hover:cursor-pointer hover:bg-verylightgrayishblue">
            {message}
        </div>
    );
}

export default PrivateMessage;
