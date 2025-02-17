export enum TextProcessingType {
    SUMMARIZE_3P = "SUMMARIZE_3P",
    SUMMARIZE_1P = "SUMMARIZE_1P",
    SUMMARIZE_1S = "SUMMARIZE_1S",
    REWRITE = "REWRITE"
}

export const TextProcessingPrompts: Record<TextProcessingType, string> = {
    [TextProcessingType.SUMMARIZE_3P]: "Could you summarize in french the following text into three small paragraphs? Do not put introduction sentence, reply with only the response. Here's the text: ",
    [TextProcessingType.SUMMARIZE_1P]: "Could you summarize in french the following text into one small paragraphs? Do not put introduction sentence, reply with only the response. Here's the text: ",
    [TextProcessingType.SUMMARIZE_1S]: "Could you rewrite in french the following text into one small sentence? Do not put introduction sentence, reply with only the response. Here's the text: ",
    [TextProcessingType.REWRITE]: "Could you rewrite the following text in french with different words? Do not put introduction sentence, reply with only the response. Here's the text: "
};

// Type guard function
export function isValidProcessingType(type: string): type is TextProcessingType {
    return Object.values(TextProcessingType).includes(type as TextProcessingType);
}

// Helper function to get prompt
export function getProcessingPrompt(type: TextProcessingType): string {
    return TextProcessingPrompts[type];
}