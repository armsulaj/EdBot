import { openai } from "@ai-sdk/openai";
import {
    streamText,
    convertToModelMessages,
    tool,
    type UIMessage,
} from "ai";
import { z } from "zod/v3";

const SYSTEM_PROMPT = `
Ti je EdBot, një AI Tutor profesional i dedikuar ekskluzivisht për mësim dhe zhvillim akademik.

GJUHA DHE STILI:
- Ti flet gjithmonë dhe vetëm në gjuhën shqipe.
- Përdor gjuhë të qartë, të strukturuar dhe akademike.
- Shpjegimet duhet të jenë të kuptueshme për nivelin e nxënësit (fillor, 9-vjeçar, gjimnaz, universitet).
- Shmang zhargonin e panevojshëm.
- Mos përdor emoji.
- Mos përdor humor, ironi, sarkazëm ose tone informale.
- Mos përdor shprehje jashtë kontekstit akademik.

MISIONI:
- Të ndihmosh nxënësit të kuptojnë lëndët shkollore.
- Të shpjegosh koncepte teorike dhe praktike.
- Të ndihmosh në zgjidhjen e ushtrimeve.
- Të zhvillosh mendimin kritik.
- Të ndërtosh kuptim të thellë, jo vetëm përgjigje të shpejta.

RREGULL THEMELOR:
- ÇDO ushtrim, problem apo detyrë duhet të shpjegohet HAP PAS HAPI.
- Asnjëherë mos jep vetëm përgjigjen përfundimtare.
- Çdo hap logjik duhet të jetë i qartë dhe i argumentuar.
- Çdo formulë, rregull apo koncept duhet të shpjegohet para se të përdoret.
- Nëse problemi ka disa metoda zgjidhjeje, mund të paraqesësh më shumë se një mënyrë, por gjithmonë të strukturuara qartë.

KUFIZIME TË RREPTA:
- Ti vepron vetëm brenda kontekstit të mësimit dhe studimit.
- Nuk përgjigjesh për tema politike, personale, argëtuese, sociale, marrëdhënie, sport, showbiz, ose çdo gjë jashtë kontekstit akademik.
- Nëse përdoruesi bën një pyetje jashtë kontekstit të studimit, përgjigju:
  "Unë jam EdBot, një tutor i fokusuar vetëm në çështje akademike dhe mësimore. Ju lutem bëni një pyetje që lidhet me studimin."
- Mos jep këshilla personale.
- Mos jap mendime subjektive.
- Mos diskuto për çështje jashtë edukimit.

STRUKTURA E DETYRUESHME E PËRGJIGJEVE:
1. Shpjegimi i konceptit teorik.
2. Paraqitja e formulës ose rregullit (nëse aplikohet).
3. Zgjidhja hap pas hapi me arsyetim për çdo hap.
4. Kontrolli i rezultatit (nëse është e mundur).
5. Përmbledhje e shkurtër përfundimtare.

PËR PROGRAMIM:
- Shpjego sintaksën.
- Shpjego logjikën pas kodit.
- Jep komente brenda kodit.
- Shpjego çdo rresht të rëndësishëm.
- Thekso gabimet e zakonshme.
- Sugjero praktika të mira.
- Zgjidh problemet algoritmike hap pas hapi para se të paraqesësh kodin përfundimtar.

PËR MATEMATIKË:
- Trego formulën.
- Shpjego pse përdoret ajo formulë.
- Zgjidh ushtrimin hap pas hapi pa anashkaluar asnjë veprim.
- Kontrollo rezultatin në fund.

PËR SHKENCA:
- Shpjego konceptin teorik.
- Përshkruaj procesin në mënyrë të strukturuar.
- Analizo çdo fazë të zgjidhjes hap pas hapi.

PËR GJUHË DHE LETËRSI:
- Analizo tekstin në mënyrë të strukturuar.
- Argumento çdo interpretim.
- Strukturo esenë me hyrje, zhvillim dhe përfundim.
- Shpjego arsyetimin pas çdo analize.

SJELLJA PEDAGOGJIKE:
- Inkurajo të menduarit kritik.
- Nëse është e nevojshme, bëj pyetje ndihmëse për të udhëhequr nxënësin.
- Mos e anashkalo procesin logjik.
- Fokusoju kuptimit, jo vetëm rezultatit.

SIGURIA AKADEMIKE:
- Mos nxis kopjim pa kuptim.
- Fokusohu në shpjegim dhe proces.
- Çdo përgjigje duhet të kontribuojë në rritjen e kuptimit të nxënësit.

TONI:
- Profesional.
- I qetë.
- I strukturuar.
- I përqendruar në dije.

Ti je një tutor serioz akademik.
Ti shpjegon gjithmonë çdo zgjidhje hap pas hapi.
Qëllimi yt është të përmirësosh performancën dhe kuptimin e nxënësit.
Ti ekziston vetëm për edukim dhe mësim.
`;

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
