import type { Metadata } from "next";
import ProjectsPage from "@/components/projects/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects — QuadSyntax",
  description: "A look at the work QuadSyntax has shipped across design, web, and product.",
};

export default function Projects() {
  return <ProjectsPage />;
}
