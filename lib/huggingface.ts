"use server";

import fetch from "node-fetch";

async function call(data) {
    const response = await fetch(
        // "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
        // "https://api-inference.huggingface.co/deepseek-ai/DeepSeek-R1",
        // "https://api-inference.huggingface.co/models/mistralai/Mistral-Small-24B-Instruct-2501",
        // "https://api-inference.huggingface.co/models/google/bigbird-pegasus-large-arxiv",
        // "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",

        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn", //summarization
        // "https://api-inference.huggingface.co/models/philschmid/bart-large-cnn-samsum", //summarization
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );
    // const result = await response.json();
    return response.json();
}

export async function main(query: string) {
    const response = await call({inputs: query, max_length: 130, min_length: 30, do_sample: false}).then((response) => {
        console.log(JSON.stringify(response, null, 2));
    });

    return response;
}

export async function summarize(query: string, max_length: number = 500, min_length: number = 150, do_sample: boolean = false) : Promise<string> {
    const response = await call({inputs: query, max_length, min_length, do_sample}).then((response) => {
        console.log(">>>> summarize ",JSON.stringify(response, null, 2));
        return response;
    });

    return response;
}
