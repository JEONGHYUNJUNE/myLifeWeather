import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { people, type Person } from "@/data/fitness";
import { FitnessDashboard } from "@/components/fitness/FitnessDashboard";
const isPerson = (value: string): value is Person =>
  value === "hyunjun" || value === "yujin";
export function generateStaticParams() {
  return [{ person: "hyunjun" }, { person: "yujin" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ person: string }>;
}): Promise<Metadata> {
  const { person } = await params;
  return {
    title: isPerson(person)
      ? `${people[person].name} · ${people[person].theme} · 운동의 계절`
      : "운동의 계절",
  };
}
export default async function PersonalFitnessPage({
  params,
}: {
  params: Promise<{ person: string }>;
}) {
  const { person } = await params;
  if (!isPerson(person)) notFound();
  return <FitnessDashboard key={person} person={person} />;
}
