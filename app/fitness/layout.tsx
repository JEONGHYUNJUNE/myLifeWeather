import "./fitness.css";
import { FitnessGuideProvider } from "@/components/fitness/FitnessGuide";
export default function FitnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FitnessGuideProvider>{children}</FitnessGuideProvider>;
}
