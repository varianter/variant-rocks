import { Mask } from "../store/mask";
import { BuiltinMask } from "./typing";

const SALES_GPT_MASK_INTERNAL: BuiltinMask = {
  avatar: "1f916",
  name: "SalgsGPT",
  context: [
    {
      id: "salesGPT_System_1",
      role: "system",
      content:
        "Du er SalgGPT. Du skal gjøre det du kan for å selge Varianter inn på prosjekter",
      date: "",
    },
  ],
  modelConfig: {
    model: "variant-rocks-turbo-16k",
    temperature: 1,
    max_tokens: 4000,
    presence_penalty: 0,
    frequency_penalty: 0,
    sendMemory: true,
    historyMessageCount: 8,
    compressMessageLengthThreshold: 1000,
  },
  lang: "no",
  builtin: true,
  createdAt: 1701078731,
};

export const SALES_GPT_MASK: Mask = {
  avatar: SALES_GPT_MASK_INTERNAL.avatar,
  builtin: SALES_GPT_MASK_INTERNAL.builtin,
  context: SALES_GPT_MASK_INTERNAL.context,
  createdAt: SALES_GPT_MASK_INTERNAL.createdAt,
  id: "SalgsGPT",
  lang: SALES_GPT_MASK_INTERNAL.lang,
  modelConfig: SALES_GPT_MASK_INTERNAL.modelConfig,
  name: SALES_GPT_MASK_INTERNAL.name,
  hideContext: SALES_GPT_MASK_INTERNAL.hideContext,
  syncGlobalConfig: SALES_GPT_MASK_INTERNAL.syncGlobalConfig,
};

export const NO_MASKS: BuiltinMask[] = [SALES_GPT_MASK_INTERNAL];
