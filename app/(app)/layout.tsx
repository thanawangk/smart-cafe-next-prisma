import Navbar from "@/components/nav/Navbar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();
  return (
    <>
      <Navbar />

      <main>{children}</main>
    </>
  );
}
