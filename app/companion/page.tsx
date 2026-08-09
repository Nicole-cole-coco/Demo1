import { Suspense } from "react";
import ChatExperience from "@/components/ChatExperience";

export default function CompanionPage() {
  return (
    <Suspense fallback={<main className="v3-page persona-universe" />}>
      <ChatExperience />
    </Suspense>
  );
}
