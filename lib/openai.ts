"use server";

import OpenAI from "openai";

import { Article, Job, JobStatus, JobType } from "@/types"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openai = new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL,
    apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "deepseek-chat",
    });
  
    console.log(completion.choices[0].message.content);
  }


export async function deepSeek(query: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are a powerful search engine. Return concise, factual answers."
                },
                { role: "user", content: query }
            ],
            temperature: 0.3,
            max_completion_tokens: 150
            // max_tokens: 150
        });
        return completion.choices[0].message.content;
    } catch (error) {
        // Type guard to check if error is an Error object
        if (error instanceof Error) {
            console.error("Search error:", error.message);
        } else {
            // Handle cases where error might not be an Error object
            console.error("An unknown error occurred:", error);
        }
        throw error;
    }
}