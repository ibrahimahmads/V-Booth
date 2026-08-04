import ProgressBar from '../atoms/ProgressBar';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

export default function StepHeader({ currentStep, totalSteps, stepTitle }: StepHeaderProps) {
  return (
    <div className="w-full space-y-2 mb-4">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-[#4648d4]">Step {currentStep} of {totalSteps}</span>
        <span className="text-[#64748B] font-medium">{stepTitle}</span>
      </div>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  );
}