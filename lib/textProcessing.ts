'use server'

import OpenAI from "openai";
import { TextProcessingType, getProcessingPrompt } from '@/types/textProcessing';

type ProcessTextResponse = {
    success: boolean;
    data: string | null;
    error?: string;
};

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
});


export async function processText(
    text: string,
    type: TextProcessingType
): Promise<ProcessTextResponse> {
    try {
        // Input validation
        if (!text || text.trim().length === 0) {
            return {
                success: false,
                data: null,
                error: 'Text is required'
            };
        }

        const prompt = getProcessingPrompt(type);
        const fullPrompt = `${prompt}${text}`;

        // Here you would typically make a call to your AI service
        // For example, using OpenAI or another service
        // const response = await openai.createCompletion({
        //   model: "your-model",
        //   prompt: fullPrompt,
        //   // ... other options
        // });

        console.log('>>>> refine');

        const completion = await openai.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are a helpful assistant." },
                {
                    role: 'user',
                    content: fullPrompt,
                }],
            // model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
            // model: "google/gemini-2.0-flash-lite-preview-02-05:free", //Good !
            // model: "deepseek/deepseek-r1:free", //bad
            model: "meta-llama/llama-3.3-70b-instruct:free",
        });

        console.log(">>>> completion: ", completion);
        console.log(">>>> result: ", completion.choices[0]?.message?.content);

        // Placeholder for the actual AI processing
        // const processedText = `Processed: ${fullPrompt}`;
        const processedText = completion.choices[0]?.message?.content;

        return {
            success: true,
            data: processedText
        };

    } catch (error) {
        console.error('Error processing text:', error);
        return {
            success: false,
            data: null,
            error: 'Failed to process text'
        };
    }
}

// You can also create a type-safe client-side wrapper
export type ProcessTextActionType = typeof processText;