interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({currentStep,totalSteps}:ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-[#e0e3e5] h-2 rounded-full overflow-hidden">
      <div 
        className="bg-[#4648d4] h-full transition-all duration-300 ease-out rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};