import { DeepSeekProvider } from "@/services/ai/providers/deepseek";
import { MockProvider } from "@/services/ai/providers/mock";
import {
  OpenAICompatibleProvider,
  OpenAIProvider
} from "@/services/ai/providers/openai";
import type { LLMProvider } from "@/services/ai/types";

export { DeepSeekProvider } from "@/services/ai/providers/deepseek";
export { MockProvider } from "@/services/ai/providers/mock";
export { OpenAICompatibleProvider, OpenAIProvider } from "@/services/ai/providers/openai";

type ProviderConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

const complete = (config: ProviderConfig) =>
  Boolean(config.apiKey && config.baseUrl && config.model);

function deepSeekConfig(): ProviderConfig {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY || "",
    baseUrl:
      process.env.DEEPSEEK_BASE_URL ||
      process.env.LLM_BASE_URL ||
      "https://api.deepseek.com",
    model:
      process.env.DEEPSEEK_MODEL ||
      process.env.LLM_MODEL ||
      "deepseek-v4-flash"
  };
}

function openAIConfig(): ProviderConfig {
  return {
    apiKey: process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || process.env.AI_API_KEY || "",
    baseUrl: process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL || process.env.AI_API_URL || "",
    model: process.env.OPENAI_MODEL || process.env.LLM_MODEL || process.env.AI_MODEL || ""
  };
}

function genericConfig(): ProviderConfig {
  return {
    apiKey: process.env.LLM_API_KEY || process.env.AI_API_KEY || "",
    baseUrl: process.env.LLM_BASE_URL || process.env.AI_API_URL || "",
    model: process.env.LLM_MODEL || process.env.AI_MODEL || ""
  };
}

export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER?.trim().toLowerCase();
  if (provider === "mock") return new MockProvider();

  const deepseek = deepSeekConfig();
  if (provider === "deepseek") {
    return complete(deepseek) ? new DeepSeekProvider(deepseek) : new MockProvider();
  }

  const openai = openAIConfig();
  if (provider === "openai") {
    return complete(openai) ? new OpenAIProvider({ ...openai, id: "openai" }) : new MockProvider();
  }

  const generic = genericConfig();
  if (["openai-compatible", "local"].includes(provider ?? "")) {
    return complete(generic)
      ? new OpenAICompatibleProvider({ id: provider ?? "openai-compatible", ...generic })
      : new MockProvider();
  }

  if (!provider && complete(deepseek) && process.env.DEEPSEEK_API_KEY) {
    return new DeepSeekProvider(deepseek);
  }
  if (!provider && complete(generic)) {
    return new OpenAICompatibleProvider({ id: "openai-compatible", ...generic });
  }

  return new MockProvider();
}
