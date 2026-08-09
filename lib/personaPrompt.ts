import { getPersonaDefinition } from "@/lib/personas";
import {
  buildPersonaSystemPrompt,
  formatPersonaDefinition
} from "@/services/ai/personaBuilder";
import type { PersonaDefinition, PersonaPromptContext } from "@/types/persona";

// Compatibility exports for existing server modules. Product chat uses services/chat.
export const compilePersonaDefinition = formatPersonaDefinition;

export function compilePersonaSystemPrompt(
  context: PersonaPromptContext,
  persona: PersonaDefinition = getPersonaDefinition(context.mbti)
) {
  return buildPersonaSystemPrompt({
    mbti: context.mbti,
    personaDefinition: persona,
    userMbti: context.userMbti,
    scenarioContext: context.scenario
      ? { kind: "companion", title: context.scenario }
      : { kind: "companion" }
  });
}
