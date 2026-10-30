import { Footer, TopMenu } from "@/src/components";
import { Sidebar } from "../../components/ui/sidebar/Sidebar";

export default function shopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className=" min-h-screen">
        <TopMenu />
        <Sidebar />
        <div className="px-0 sm:px-10">{children}</div>
        <Footer />
      </main>
    </>
  );
}
