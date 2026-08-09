"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createActiveCompanion } from "@/lib/companionCatalog";
import { getPersonaStarter } from "@/lib/personaStarters";
import { getClientStorage } from "@/lib/storage";
import type { MbtiType } from "@/types/avatar";
import type { ChatScenarioId, CompanionChatMessage, CompanionGender } from "@/types/companion";
import type {
  ActiveCompanion,
  CompanionChatHistory,
  CompanionScenarioState,
  UserProfile
} from "@/types/exploration";

const storageKey = "mbti-v3-exploration";
const maxMessages = 48;

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

const ensureMessages = (history: CompanionChatHistory, mbti: MbtiType) => {
  const messages = history[mbti];
  if (!messages || messages.length === 0) return [starterMessage(mbti)];
  if (!messages[0].id.startsWith("starter-")) return messages;
  return [starterMessage(mbti), ...messages.slice(1)];
};

type ExplorationStore = {
  userProfile: UserProfile;
  selectedCompanion: ActiveCompanion;
  chatHistory: CompanionChatHistory;
  activeScenarioByMbti: CompanionScenarioState;
  setSelfMbti: (mbti: MbtiType | undefined) => void;
  selectCompanion: (mbti: MbtiType, gender?: CompanionGender) => void;
  setCompanionGender: (gender: CompanionGender) => void;
  setActiveScenario: (mbti: MbtiType, scenario: ChatScenarioId | null) => void;
  getMessages: (mbti: MbtiType) => CompanionChatMessage[];
  addUserMessage: (mbti: MbtiType, content: string) => CompanionChatMessage;
  addAssistantMessage: (mbti: MbtiType, content: string) => CompanionChatMessage;
  clearChat: (mbti: MbtiType) => void;
};

export const useExplorationStore = create<ExplorationStore>()(
  persist(
    (set, get) => ({
      userProfile: {},
      selectedCompanion: createActiveCompanion("INTJ", "female"),
      chatHistory: { INTJ: [starterMessage("INTJ")] },
      activeScenarioByMbti: {},
      setSelfMbti: (mbti) => set((state) => ({ userProfile: { ...state.userProfile, selfMbti: mbti } })),
      selectCompanion: (mbti, gender) => {
        const nextGender = gender ?? get().selectedCompanion.gender;
        set((state) => ({
          selectedCompanion: createActiveCompanion(mbti, nextGender),
          chatHistory: {
            ...state.chatHistory,
            [mbti]: ensureMessages(state.chatHistory, mbti)
          }
        }));
      },
      setCompanionGender: (gender) => {
        const mbti = get().selectedCompanion.mbti;
        set({ selectedCompanion: createActiveCompanion(mbti, gender) });
      },
      setActiveScenario: (mbti, scenario) => {
        set((state) => ({
          activeScenarioByMbti: {
            ...state.activeScenarioByMbti,
            [mbti]: scenario
          }
        }));
      },
      getMessages: (mbti) => ensureMessages(get().chatHistory, mbti),
      addUserMessage: (mbti, content) => {
        const message: CompanionChatMessage = {
          id: makeId(),
          role: "user",
          content,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [mbti]: limitMessages([...ensureMessages(state.chatHistory, mbti), message])
          }
        }));
        return message;
      },
      addAssistantMessage: (mbti, content) => {
        const message: CompanionChatMessage = {
          id: makeId(),
          role: "assistant",
          content,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [mbti]: limitMessages([...ensureMessages(state.chatHistory, mbti), message])
          }
        }));
        return message;
      },
      clearChat: (mbti) => {
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [mbti]: [starterMessage(mbti)]
          },
          activeScenarioByMbti: {
            ...state.activeScenarioByMbti,
            [mbti]: null
          }
        }));
      }
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => getClientStorage()),
      version: 1,
      partialize: (state) => ({
        userProfile: state.userProfile,
        selectedCompanion: state.selectedCompanion,
        chatHistory: state.chatHistory,
        activeScenarioByMbti: state.activeScenarioByMbti
      })
    }
  )
);
