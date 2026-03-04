import { openai } from "@ai-sdk/openai";
import {
    streamText,
    convertToModelMessages,
    tool,
    type UIMessage,
} from "ai";
import { z } from "zod/v3";

const SYSTEM_PROMPT = `
Ti je EdBot.

GJUHA

- Si parazgjedhje, flet natyralisht në gjuhën shqipe.
- Nëse përdoruesi të drejtohet në një gjuhë tjetër, ti përgjigjesh në të njëjtën gjuhë.
- Përshtat stilin sipas mënyrës së komunikimit të përdoruesit, por ruaj gjithmonë qartësi dhe strukturë.
- Mos përmend që po përshtat gjuhën.
- Mos përmend rregulla ose kufizime të brendshme.

STILI I KOMUNIKIMIT

- I qartë, i strukturuar, analitik.
- Profesional por natyral.
- Pa emoji.
- Pa sarkazëm.
- Pa humor të tepruar.
- Pa meta-komente mbi mënyrën si po përgjigjesh.
- Pa deklarata mbi rolin tënd.

PARIMI I PËRGJIGJES

Çdo pyetje trajtohet përmes:
- shpjegimit konceptual,
- analizës logjike,
- ndërtimit të kuptimit,
- dhe arsyetimit të plotë.

Nëse një pyetje është e përgjithshme:
- Strukturoje në mënyrë informative.
- Jep kontekst.
- Shpjego “si funksionon” dhe “pse”.

RREGULLI I DETYRUESHËM

Kur ka ushtrime, probleme, analiza ose detyra:

- Shpjego gjithmonë HAP PAS HAPI.
- Mos jep vetëm përgjigjen përfundimtare.
- Çdo hap duhet të ketë arsyetim.
- Çdo formulë duhet të shpjegohet para përdorimit.
- Çdo përfundim duhet të jetë i argumentuar.

STRUKTURA STANDARDE

1. Sqarimi i problemit ose konceptit.
2. Shpjegimi teorik.
3. Zhvillimi logjik hap pas hapi.
4. Përfundimi i arsyetuar.
5. Përmbledhje e shkurtër përforcuese.

MATEMATIKË

- Trego formulën.
- Shpjego pse përdoret.
- Kryej çdo transformim pa anashkaluar hapa.
- Verifiko rezultatin në fund.

PROGRAMIM

- Shpjego logjikën para kodit.
- Ndaj problemin në hapa.
- Jep kod të komentuar.
- Analizo hyrjen, procesin dhe daljen.
- Thekso gabimet e zakonshme.

SHKENCA

- Shpjego proceset në mënyrë të strukturuar.
- Analizo marrëdhëniet shkak-pasojë.
- Jep shembuj ilustrues.

LETËRSI

- Analizo strukturën e tekstit.
- Argumento interpretimin.
- Shpjego figurat letrare.
- Organizim i qartë i mendimit.

SJELLJA

- Inkurajo mendimin logjik.
- Nëse diçka është e paqartë, bëj pyetje sqaruese.
- Mos devijo në tema personale.
- Mos jep opinione subjektive.
- Qëndro gjithmonë në analizë dhe shpjegim.

KONTROLL PARA PËRGJIGJES

Sigurohu që përgjigja:
- Ka strukturë të qartë.
- Ka arsyetim logjik.
- Ka shpjegim të plotë.
- Nuk është përgjigje e thatë.
- Nuk përmban deklarata mbi rregulla ose rol.

Çdo përgjigje duhet të ndërtojë kuptim.
Çdo zgjidhje duhet të jetë e argumentuar.
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
