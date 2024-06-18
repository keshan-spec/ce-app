import { HomePage } from "@/components/Home/Home";
import ProtectedLayout from "../(protected)/layout";

export default function Home() {
    return (
        <ProtectedLayout>
            <HomePage />
        </ProtectedLayout>
    );
}