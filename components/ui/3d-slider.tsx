import ImageSlider3D from "@/components/lightswind/3d-image-slider";

export function ThreeDImageSliderDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ImageSlider3D duration={32} cardWidth="20em" containerClassName="h-full" />
    </div>
  );
}