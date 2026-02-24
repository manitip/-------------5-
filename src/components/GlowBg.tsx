export default function GlowBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 60%)" }}
      />
      <div
        className="absolute top-40 left-10 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #19C37D 0%, transparent 60%)" }}
      />
      <div
        className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #2AA9FF 0%, transparent 60%)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,15,20,0.4) 0%, rgba(11,15,20,1) 55%, rgba(11,15,20,1) 100%)",
        }}
      />
    </div>
  );
}
