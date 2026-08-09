import type { MbtiType } from "@/types/avatar";
import type { ChatScenarioId, CompanionChatMessage, CompanionGender } from "@/types/companion";

export type UserProfile = {
  selfMbti?: MbtiType;
};

export type ActiveCompanion = {
  mbti: MbtiType;
  gender: CompanionGender;
  avatar: string;
};

export type CompanionChatHistory = Partial<Record<MbtiType, CompanionChatMessage[]>>;

export type CompanionScenarioState = Partial<Record<MbtiType, ChatScenarioId | null>>;
