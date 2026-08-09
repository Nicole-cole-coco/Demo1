"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getLabScenario } from "@/lib/labScenarios";
import { applyRelationshipDelta, createLabReport } from "@/lib/labScoring";
import { getClientStorage } from "@/lib/storage";
import type { MbtiType } from "@/types/avatar";
import type { CompanionGender } from "@/types/companion";
import type {
  LabChoiceRecord,
  LabReport,
  LabScenarioId,
  LabSession
} from "@/types/lab";

const storageKey = "mbti-v3-relationship-lab";

type LabStore = {
  activeSession: LabSession | null;
  latestReport: LabReport | null;
  startScenario: (
    scenarioId: LabScenarioId,
    targetGender: CompanionGender,
    targetMbti?: MbtiType
  ) => void;
  chooseOption: (optionId: string, reactionOverride?: string) => LabReport | null;
  resetSession: () => void;
  clearReport: () => void;
};

export const useLabStore = create<LabStore>()(
  persist(
    (set, get) => ({
      activeSession: null,
      latestReport: null,
      startScenario: (scenarioId, targetGender, targetMbti) => {
        const scenario = getLabScenario(scenarioId);
        const firstStage = scenario.stages[0];
        const selectedTarget =
          targetMbti && scenario.targetMbtis.includes(targetMbti)
            ? targetMbti
            : scenario.targetMbti;
        set({
          activeSession: {
            scenarioId,
            targetGender,
            targetMbti: selectedTarget,
            currentStageId: firstStage.id,
            choices: [],
            relationshipState: { ...scenario.initialRelationshipState },
            relationshipHistory: [],
            startedAt: new Date().toISOString()
          }
        });
      },
      chooseOption: (optionId, reactionOverride) => {
        const session = get().activeSession;
        if (!session) return null;

        const scenario = getLabScenario(session.scenarioId);
        const stage = scenario.stages.find((item) => item.id === session.currentStageId);
        const option = stage?.options.find((item) => item.id === optionId);
        if (!stage || !option) return null;

        const targetMbti = session.targetMbti ?? scenario.targetMbti;
        const previousRelationshipState =
          session.relationshipState ?? scenario.initialRelationshipState;
        const relationshipState = applyRelationshipDelta(
          previousRelationshipState,
          option.relationshipDelta
        );
        const resolvedReaction =
          reactionOverride?.trim().slice(0, 400) ??
          option.reactions?.[targetMbti] ??
          option.reaction;

        const record: LabChoiceRecord = {
          stageId: stage.id,
          optionId: option.id,
          label: option.label,
          intentTags: option.intentTags,
          scoreDelta: option.scoreDelta,
          relationshipDelta: option.relationshipDelta,
          reaction: option.reaction,
          resolvedReaction,
          advantage: option.advantage,
          tradeoff: option.tradeoff,
          resultingState: relationshipState
        };
        const choices = [...session.choices, record];
        const relationshipHistory = [
          ...(session.relationshipHistory ?? []),
          {
            stageId: stage.id,
            state: relationshipState,
            delta: option.relationshipDelta
          }
        ];
        const nextSession: LabSession = {
          ...session,
          currentStageId: option.nextStage ?? stage.id,
          choices,
          relationshipState,
          relationshipHistory
        };

        if (!option.nextStage) {
          const report = createLabReport(scenario, nextSession, choices);
          set({ activeSession: null, latestReport: report });
          return report;
        }

        set({
          activeSession: nextSession
        });
        return null;
      },
      resetSession: () => set({ activeSession: null }),
      clearReport: () => set({ latestReport: null })
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => getClientStorage()),
      version: 1,
      partialize: (state) => ({
        activeSession: state.activeSession,
        latestReport: state.latestReport
      })
    }
  )
);
