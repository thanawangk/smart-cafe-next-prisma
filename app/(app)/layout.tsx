import Navbar from "@/components/nav/Navbar";
import SideBar from "@/components/nav/Sidebar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();
  return (
    <>
      <Navbar />
      <div className="layout">
        <SideBar role="barista" />
        <main>{children}</main>
      </div>
    </>
  );
}
