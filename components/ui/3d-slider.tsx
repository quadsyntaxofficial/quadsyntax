import ImageSlider3D from "@/components/lightswind/3d-image-slider";

export function ThreeDImageSliderDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <ImageSlider3D
        duration={32}
        cardWidth="clamp(6.5rem, 22vw, 17.5em)"
        perspective="clamp(18rem, 45vw, 35em)"
        containerClassName="h-full"
      />
    </div>
  );
}