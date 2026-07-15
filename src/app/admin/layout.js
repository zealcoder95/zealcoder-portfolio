export const metadata = {
  title: "ZealCoder Admin",
  description: "ZealCoder Yönetim Paneli",
};

export default function AdminLayout({ children }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      {children}
    </main>
  );
}