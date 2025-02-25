export enum TextProcessingType {
    SUMMARIZE_3P = "SUMMARIZE_3P",
    SUMMARIZE_1P = "SUMMARIZE_1P",
    SUMMARIZE_1S = "SUMMARIZE_1S",
    REWRITE = "REWRITE"
}

export const TextProcessingPrompts: Record<TextProcessingType, string> = {
    [TextProcessingType.SUMMARIZE_3P]: "Could you summarize in french the following text into three small paragraphs (less than 120 words each)? Do not put introduction sentence, reply with only the response. ",
    [TextProcessingType.SUMMARIZE_1P]: "Could you summarize in french the following text into one small paragraphs (less than 120 words)? Do not put introduction sentence, reply with only the response. ",
    [TextProcessingType.SUMMARIZE_1S]: "Could you rewrite in french the following text into one small sentence (less than 60 words)? Do not put introduction sentence, reply with only the response. ",
    [TextProcessingType.REWRITE]: "Could you rewrite the following text in french with different words? Do not put introduction sentence, reply with only the response. "
};

// Type guard function
export function isValidProcessingType(type: string): type is TextProcessingType {
    return Object.values(TextProcessingType).includes(type as TextProcessingType);
}

// Helper function to get prompt
export function getProcessingPrompt(type: TextProcessingType): string {
    return TextProcessingPrompts[type];
}