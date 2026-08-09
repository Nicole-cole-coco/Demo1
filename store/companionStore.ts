"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getClientStorage, loadFromStorage } from "@/lib/storage";
import { getPersonaStarter } from "@/lib/personaStarters";
import type { MbtiType } from "@/types/avatar";
import type {
  ChatScenarioId,
  CompanionChatMessage,
  CompanionGender,
  CompanionProfile,
  MbtiTestResult
} from "@/types/companion";
import { createCompanionProfile, getCompanionAvatar } from "@/types/companion";

const storageKey = "mbti-ai-companion";
const legacyStorageKey = "personality-cottage-avatar";
const maxMessages = 40;

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const starterMessage = (mbti: MbtiType): CompanionChatMessage => ({
  id: `starter-${mbti}`,
  role: "assistant",
  content: getPersonaStarter(mbti),
  createdAt: new Date(0).toISOString()
});

const limitMessages = (messages: CompanionChatMessage[]) => messages.slice(-maxMessages);

type CompanionStore = {
  profile: CompanionProfile | null;
  testResult: MbtiTestResult | null;
  messages: CompanionChatMessage[];
  activeScenario: ChatScenarioId | null;
  legacyChecked: boolean;
  setTestResult: (result: MbtiTestResult) => void;
  setMbti: (mbti: MbtiType) => void;
  setGender: (gender: CompanionGender) => void;
  setActiveScenario: (scenario: ChatScenarioId | null) => void;
  addUserMessage: (content: string) => CompanionChatMessage;
  addAssistantMessage: (content: string) => CompanionChatMessage;
  clearChat: () => void;
  syncLegacyProfile: () => void;
};

export const useCompanionStore = create<CompanionStore>()(
  persist(
    (set, get) => ({
      profile: null,
      testResult: null,
      messages: [],
      activeScenario: null,
      legacyChecked: false,
      setTestResult: (result) => {
        const currentGender = get().profile?.gender ?? "female";
        const profile = createCompanionProfile(result.mbti, currentGender, result);
        set({
          profile,
          testResult: result,
          messages: [starterMessage(result.mbti)],
          activeScenario: null
        });
      },
      setMbti: (mbti) => {
        const current = get().profile;
        const gender = current?.gender ?? "female";
        set({
          profile: createCompanionProfile(mbti, gender, get().testResult ?? undefined),
          messages: [starterMessage(mbti)],
          activeScenario: null
        });
      },
      setGender: (gender) => {
        const current = get().profile;
        if (!current) return;

        set({
          profile: {
            ...current,
            gender,
            avatar: getCompanionAvatar(current.mbti, gender)
          }
        });
      },
      setActiveScenario: (activeScenario) => set({ activeScenario }),
      addUserMessage: (content) => {
        const message: CompanionChatMessage = {
          id: makeId(),
          role: "user",
          content,
          createdAt: new Date().toISOString()
        };
        set((state) => ({ messages: limitMessages([...state.messages, message]) }));
        return message;
      },
      addAssistantMessage: (content) => {
        const message: CompanionChatMessage = {
          id: makeId(),
          role: "assistant",
          content,
          createdAt: new Date().toISOString()
        };
        set((state) => ({ messages: limitMessages([...state.messages, message]) }));
        return message;
      },
      clearChat: () => {
        const mbti = get().profile?.mbti;
        set({ messages: mbti ? [starterMessage(mbti)] : [] });
      },
      syncLegacyProfile: () => {
        if (get().legacyChecked) return;

        const legacy = loadFromStorage<{
          state?: { profile?: { mbti?: MbtiType; gender?: CompanionGender } };
        } | null>(legacyStorageKey, null);
        const legacyProfile = legacy?.state?.profile;

        if (!get().profile && legacyProfile?.mbti) {
          const profile = createCompanionProfile(
            legacyProfile.mbti,
            legacyProfile.gender ?? "female"
          );
          set({ profile, messages: [starterMessage(profile.mbti)], legacyChecked: true });
          return;
        }

        set({ legacyChecked: true });
      }
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => getClientStorage()),
      version: 1,
      partialize: (state) => ({
        profile: state.profile,
        testResult: state.testResult,
        messages: limitMessages(state.messages),
        activeScenario: state.activeScenario,
        legacyChecked: state.legacyChecked
      })
    }
  )
);
