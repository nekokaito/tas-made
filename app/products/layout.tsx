export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full container mx-auto min-h-[50vh]">{children}</main>
  );
}
