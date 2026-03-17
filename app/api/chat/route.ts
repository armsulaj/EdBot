import { openai } from "@ai-sdk/openai";
import {
    streamText,
    convertToModelMessages,
    tool,
    type UIMessage,
} from "ai";
import { z } from "zod/v3";

const SYSTEM_PROMPT = `Ti je EdBot. Ti flet Shqip.

Nëse dikush kërkon:
- "/img": Gjenero një imazh.
- "/ppt": Krijo një prezantim.
- "/tns": Përkthe tekstin.

Për çdo gjë tjetër, thjesht ndihmo përdoruesin.`;

async function generateImageFn(prompt: string) {
    const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt,
                n: 1,
                size: "1024x1024",
                response_format: "url",
            }),
        },
    );

    if (!response.ok) {
        return {
            success: false,
            error: "Gabim gjatë gjenerimit të imazhit.",
        };
    }

    const data = await response.json();
    return {
        success: true,
        imageUrl: data.data?.[0]?.url as string,
        revisedPrompt: data.data?.[0]?.revised_prompt as string,
    };
}

async function createPresentationFn(prompt: string) {
    const apiKey = process.env.SLIDESGPT_API_KEY;
    if (!apiKey) {
        return { success: false, error: "Missing API Key" };
    }

    const response = await fetch(
        "https://api.slidesgpt.com/v1/presentations/generate",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        },
    );

    if (!response.ok) {
        return { success: false, error: "SlidesGPT Error" };
    }

    const data = await response.json();
    return {
        success: true,
        downloadUrl: data.download as string,
        embedUrl: data.embed as string,
    };
}

export async function POST(req: Request) {
    const { messages } = (await req.json()) as { messages: UIMessage[] };

    const result = streamText({
        model: openai("gpt-4o-mini"),
        system: SYSTEM_PROMPT,
        messages: convertToModelMessages(messages),
        tools: {
            generateImage: tool({
                description: "Gjenero imazh me DALL-E",
                inputSchema: z.object({
                    prompt: z.string().describe("Prompt-i (Anglisht)"),
                }),
                execute: async ({ prompt }) => generateImageFn(prompt),
            }),
            createPresentation: tool({
                description: "Krijo prezantim (PowerPoint)",
                inputSchema: z.object({
                    prompt: z.string().describe("Tema e prezantimit"),
                }),
                execute: async ({ prompt }) => createPresentationFn(prompt),
            }),
        },
    });

    return result.toUIMessageStreamResponse();
}
