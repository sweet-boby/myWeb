import { ScratchToReveal } from "./magicui/scratch-to-reveal";

export function ScratchToRevealDemo() {
  return (
    <ScratchToReveal
      width={500}
      height={250}
      minScratchPercentage={70}
      className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100 w-auto justify-self-center"
      gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
    >
      <p className={'text-2xl font-bold text-gray-800'}>
        fafadfsdfsdafdsafsdkfjalskfjaksdflkdjflkajslkf
      </p>
    </ScratchToReveal>
  );
}
