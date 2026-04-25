import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

const steps = [Step1, Step2, Step3];

interface StepRendererProps {
  step: number;
}

export const StepRenderer = ({ step }: StepRendererProps) => {
  const CurrentStep = steps[step];
  return <CurrentStep />;
};
