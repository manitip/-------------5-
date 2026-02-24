import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-24 pt-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
