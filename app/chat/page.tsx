import { Suspense } from "react";
import ChatExperience from "@/components/ChatExperience";

export default function ChatPage() {
  return (
    <Suspense fallback={<main className="v3-page" />}>
      <ChatExperience />
    </Suspense>
  );
}
