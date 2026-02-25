"use client";

import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ImageIcon,
    DownloadIcon,
    Loader2Icon,
    PresentationIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ImageResult = ({ result }: { result: any }) => {
    if (!result?.success) {
        return (
            <div className="px-4 py-2 text-sm text-red-400">
                {"❌ "}{String(result?.error || "Gjenerimi dështoi.")}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 px-4 pt-2">
            {result.imageUrl && (
                <a
                    href={String(result.imageUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-xl border border-border"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={String(result.imageUrl)}
                        alt="Generated"
                        className="w-full max-w-lg rounded-xl transition-transform group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                        <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Full Size
                        </span>
                    </div>
                </a>
            )}
        </div>
    );
};

const PresentationResult = ({ result }: { result: any }) => {
    if (!result?.success) {
        return (
            <div className="px-4 py-2 text-sm text-red-400">
                {"❌ "}{String(result?.error || "Krijimi dështoi.")}
            </div>
        );
    }

    const downloadUrl = String(result.downloadUrl || "");
    const embedUrl = String(result.embedUrl || "");

    return (
        <div className="flex flex-col gap-3 px-4 pt-2">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <PresentationIcon className="size-6 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Ready</span>
                    <span className="text-xs text-muted-foreground">.pptx</span>
                </div>
                <div className="ml-auto flex gap-2">
                    {downloadUrl && (
                        <a href={downloadUrl} target="_blank" rel="noopener">
                            <Button size="sm" className="rounded-full gap-1.5">
                                <DownloadIcon className="size-3.5" />
                                Shkarko
                            </Button>
                        </a>
                    )}
                </div>
            </div>
            {embedUrl && (
                <div className="overflow-hidden rounded-xl border border-border">
                    <iframe
                        src={embedUrl}
                        className="h-[400px] w-full"
                        title="Preview"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    );
};

export const ToolFallback: ToolCallMessagePartComponent = ({
    toolName,
    argsText,
    result,
    status,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const isRunning = status?.type === "running";

    const labels: Record<string, { label: string; icon: React.ReactNode }> = {
        generateImage: {
            label: "Gjenerim imazhi",
            icon: <ImageIcon className="size-4" />,
        },
        createPresentation: {
            label: "Krijim prezantimi",
            icon: <PresentationIcon className="size-4" />,
        },
    };

    const info = labels[toolName] || {
        label: toolName,
        icon: <CheckIcon className="size-4" />,
    };

    const renderResult = () => {
        if (isRunning) {
            return (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                    <Loader2Icon className="size-4 animate-spin" />
                    Duke punuar...
                </div>
            );
        }

        if (result === undefined) return null;

        if (toolName === "generateImage") return <ImageResult result={result} />;
        if (toolName === "createPresentation") return <PresentationResult result={result} />;

        return (
            <div className="px-4 pt-2 border-t border-dashed">
                <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                </pre>
            </div>
        );
    };

    return (
        <div className="mb-4 flex flex-col gap-3 rounded-lg border py-3">
            <div className="flex items-center gap-2 px-4">
                {isRunning ? (
                    <Loader2Icon className="size-4 animate-spin text-primary" />
                ) : (
                    <span className="text-primary">{info.icon}</span>
                )}
                <p className="flex-grow text-sm">
                    {isRunning ? (
                        <span className="text-muted-foreground">{info.label}...</span>
                    ) : (
                        <span>{info.label} <CheckIcon className="inline size-3.5 text-green-500 mb-0.5" /></span>
                    )}
                </p>
                {!isRunning && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="size-7 p-0"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <ChevronDownIcon className="size-4" /> : <ChevronUpIcon className="size-4" />}
                    </Button>
                )}
            </div>

            {(toolName === "generateImage" || toolName === "createPresentation" || isRunning) && renderResult()}

            {!isCollapsed && !isRunning && (
                <div className="flex flex-col gap-2 border-t pt-2">
                    <div className="px-4 text-xs">
                        <p className="font-medium text-muted-foreground mb-1">Raw:</p>
                        <pre className="whitespace-pre-wrap">{argsText}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};
