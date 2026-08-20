// Placeholder background footage — free-license stock video (Pexels, "Driving Through
// Scenic Countryside Road" by Altaf Shah, https://www.pexels.com/video/driving-through-scenic-countryside-road-33493661/),
// standing in for licensed RREC/member footage. Deliberately generic (no car badge or
// branding visible) to avoid trademark risk from an unlicensed clip. Replace before production.
export default function BackgroundVideo({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src="/video/hero-drive.mp4"
      poster="/video/hero-drive-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
}
