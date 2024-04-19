import { ClientLayout } from "./ClientLayout";
import { Posts } from "./Posts";
import MainLayout from "./layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <ClientLayout>
        <Posts />
      </ClientLayout>
    </MainLayout>
  );
}
