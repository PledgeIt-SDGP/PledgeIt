import "react";
import HeroContent from "../components/hero/HeroContent";
import HeroFeature from "../components/hero/HeroFeature";

function hero() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center">
      <HeroContent />
      <HeroFeature />
    </div>
  );
}

export default hero;
