import FlipDigit from "./FlipDigit";

export default function FlipUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const padded = String(Math.max(0, value)).padStart(2, "0");
  const [tens, ones] = padded.split("");

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="flex gap-1 sm:gap-1.5">
        <FlipDigit digit={tens} />
        <FlipDigit digit={ones} />
      </div>
      <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white/50 font-medium">
        {label}
      </span>
    </div>
  );
}
