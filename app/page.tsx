import ResumeBuilder from "@/components/resume-builder";

export default function HomePage() {
  return (
    <main>
      <div className="bg-[url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80')] relative overflow-hidden bg-cover bg-center">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24 text-center text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">
            TradeCraft Resume Builder
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Turn jobsite wins into a blue-collar resume that gets callbacks
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm text-indigo-100 md:text-base">
            Drop in your best stories and we handle the layout, language, and
            structure hiring managers look for. Built for skilled trades,
            warehouse operators, maintenance techs, and everyone who keeps the
            world running.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.3em] text-indigo-200">
            <span>Role-specific bullet library</span>
            <span>Printable PDF ready</span>
            <span>Trade-tested language</span>
          </div>
        </div>
      </div>
      <ResumeBuilder />
    </main>
  );
}
