import { OpenAICompatibleProvider } from "@/services/ai/providers/openai";

export type DeepSeekProviderConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export class DeepSeekProvider extends OpenAICompatibleProvider {
  constructor(config: DeepSeekProviderConfig) {
    super({ id: "deepseek", ...config });
  }
}
