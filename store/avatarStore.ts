"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getClientStorage } from "@/lib/storage";
import type {
  AvatarOptions,
  AvatarProfile,
  AvatarStats,
  Gender,
  MbtiType,
  Mood
} from "@/types/avatar";
import {
  defaultAvatarOptions,
  defaultStats,
  getMbtiMeta,
  getRecommendedOptionsForMbti,
  isOutfitAllowedForMbti
} from "@/types/avatar";
import type { ChatMessage } from "@/types/chat";

const storageKey = "personality-cottage-avatar";

const moods: Mood[] = ["平静", "开心", "害羞", "元气", "困困", "灵感闪烁"];

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const clamp = (value: number, min = 0, max = 100) => {
  return Math.max(min, Math.min(max, value));
};

const defaultProfile: AvatarProfile = {
  id: "local-avatar",
  name: "小杏",
  gender: "female",
  mbti: "INFP",
  clan: getMbtiMeta("INFP").clan,
  mood: "平静",
  options: {
    ...defaultAvatarOptions,
    ...getRecommendedOptionsForMbti("INFP")
  }
};

const starterMessages: ChatMessage[] = [
  {
    id: "starter-1",
    role: "assistant",
    content: "我已经把小屋的灯打开啦。今天想和我聊点什么？",
    createdAt: new Date(0).toISOString()
  }
];

type AvatarStore = {
  profile: AvatarProfile;
  stats: AvatarStats;
  messages: ChatMessage[];
  setMbti: (mbti: MbtiType) => void;
  setGender: (gender: Gender) => void;
  updateName: (name: string) => void;
  updateOptions: (options: Partial<AvatarOptions>) => void;
  moveIn: () => void;
  petHead: () => void;
  feed: () => void;
  refreshTodayStatus: () => void;
  addUserMessage: (content: string) => ChatMessage;
  addAssistantMessage: (content: string, mood?: Mood) => ChatMessage;
  clearChat: () => void;
};

export const useAvatarStore = create<AvatarStore>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      stats: defaultStats,
      messages: starterMessages,
      setMbti: (mbti) => {
        const meta = getMbtiMeta(mbti);
        set((state) => ({
          profile: {
            ...state.profile,
            mbti,
            clan: meta.clan,
            mood: "平静",
            options: {
              ...state.profile.options,
              ...getRecommendedOptionsForMbti(mbti)
            }
          }
        }));
      },
      setGender: (gender) => {
        set((state) => ({
          profile: {
            ...state.profile,
            gender
          }
        }));
      },
      updateName: (name) => {
        set((state) => ({
          profile: {
            ...state.profile,
            name
          }
        }));
      },
      updateOptions: (options) => {
        set((state) => ({
          profile: {
            ...state.profile,
            options: {
              ...state.profile.options,
              ...options,
              outfit:
                options.outfit && isOutfitAllowedForMbti(state.profile.mbti, options.outfit)
                  ? options.outfit
                  : state.profile.options.outfit
            }
          }
        }));
      },
      moveIn: () => {
        set((state) => ({
          profile: {
            ...state.profile,
            id: state.profile.id || makeId(),
            name: state.profile.name.trim() || "小杏",
            mood: "开心"
          },
          stats: {
            intimacy: Math.max(state.stats.intimacy, 10),
            energy: Math.max(state.stats.energy, 72),
            inspiration: Math.max(state.stats.inspiration, 46)
          }
        }));
      },
      petHead: () => {
        set((state) => ({
          profile: {
            ...state.profile,
            mood: "害羞"
          },
          stats: {
            ...state.stats,
            intimacy: clamp(state.stats.intimacy + 2)
          }
        }));
      },
      feed: () => {
        set((state) => ({
          profile: {
            ...state.profile,
            mood: "元气"
          },
          stats: {
            ...state.stats,
            energy: clamp(state.stats.energy + 12),
            intimacy: clamp(state.stats.intimacy + 1)
          }
        }));
      },
      refreshTodayStatus: () => {
        const mood = moods[Math.floor(Math.random() * moods.length)];
        set((state) => ({
          profile: {
            ...state.profile,
            mood
          },
          stats: {
            intimacy: state.stats.intimacy,
            energy: clamp(state.stats.energy - 4 + Math.floor(Math.random() * 14)),
            inspiration: clamp(
              state.stats.inspiration + Math.floor(Math.random() * 16) - 3
            )
          }
        }));
      },
      addUserMessage: (content) => {
        const message: ChatMessage = {
          id: makeId(),
          role: "user",
          content,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          messages: [...state.messages, message],
          stats: {
            ...state.stats,
            intimacy: clamp(state.stats.intimacy + 1)
          }
        }));

        return message;
      },
      addAssistantMessage: (content, mood) => {
        const message: ChatMessage = {
          id: makeId(),
          role: "assistant",
          content,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          messages: [...state.messages, message],
          profile: mood
            ? {
                ...state.profile,
                mood
              }
            : state.profile
        }));

        return message;
      },
      clearChat: () => {
        set({ messages: starterMessages });
      }
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => getClientStorage()),
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<AvatarStore>;
        const mbti = state.profile?.mbti ?? defaultProfile.mbti;
        const recommendedOptions = getRecommendedOptionsForMbti(mbti);
        const outfit =
          state.profile?.options?.outfit &&
          isOutfitAllowedForMbti(mbti, state.profile.options.outfit)
            ? state.profile.options.outfit
            : recommendedOptions.outfit;

        return {
          ...state,
          profile: {
            ...defaultProfile,
            ...state.profile,
            gender: state.profile?.gender ?? "female",
            clan: getMbtiMeta(mbti).clan,
            options: {
              ...defaultAvatarOptions,
              ...state.profile?.options,
              ...recommendedOptions,
              outfit
            }
          },
          stats: state.stats ?? defaultStats,
          messages: state.messages?.length ? state.messages : starterMessages
        };
      }
    }
  )
);
