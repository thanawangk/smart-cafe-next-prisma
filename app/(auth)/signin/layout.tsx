import "@/app/globals.css";

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F7F8FB] min-h-screen grid place-items-center p-4">
      {children}
    </div>
  );
}
