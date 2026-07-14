export const metadata = {
  title: "ZealCoder Admin",
  description: "ZealCoder Yönetim Paneli",
};

export default function AdminLayout({
  children,
}) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}