import type {
  ChatMessage,
  LLMProvider,
  LLMUsage,
  ProviderChatOptions,
  ProviderChatResult
} from "@/services/ai/types";

export type OpenAICompatibleConfig = {
  id: string;
  apiKey: string;
  baseUrl: string;
  model: string;
};

type OpenAICompatibleResponse = {
  choices?: Array<{
    message?: { content?: string | Array<{ text?: string }> };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

function extractReply(data: OpenAICompatibleResponse) {
  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content.map((part) => part.text?.trim() ?? "").filter(Boolean).join("\n").trim();
}

function extractUsage(data: OpenAICompatibleResponse): LLMUsage | undefined {
  if (!data.usage) return undefined;
  return {
    promptTokens: data.usage.prompt_tokens,
    completionTokens: data.usage.completion_tokens,
    totalTokens: data.usage.total_tokens
  };
}

export class OpenAICompatibleProvider implements LLMProvider {
  readonly id: string;
  readonly model: string;
  private readonly apiKey: string;
  private readonly endpoint: string;

  constructor(config: OpenAICompatibleConfig) {
    this.id = config.id;
    this.model = config.model;
    this.apiKey = config.apiKey;
    const base = config.baseUrl.replace(/\/$/, "");
    this.endpoint = base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
  }

  async chat(messages: readonly ChatMessage[], options: ProviderChatOptions): Promise<ProviderChatResult> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        temperature: options.temperature ?? 0.78,
        max_tokens: options.maxTokens,
        messages: messages.map(({ role, content }) => ({ role, content }))
      }),
      signal: options.signal
    });

    if (!response.ok) throw new Error("LLM provider request failed");
    const data = (await response.json()) as OpenAICompatibleResponse;
    const reply = extractReply(data);
    if (!reply) throw new Error("LLM provider returned an empty reply");

    return { reply, model: this.model, usage: extractUsage(data) };
  }
}

export class OpenAIProvider extends OpenAICompatibleProvider {
  constructor(config: Omit<OpenAICompatibleConfig, "id"> & { id?: string }) {
    super({ ...config, id: config.id ?? "openai-compatible" });
  }
}
