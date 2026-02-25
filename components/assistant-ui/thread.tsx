"use client";

import {
    ArrowDownIcon,
    ArrowUpIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CopyIcon,
    PencilIcon,
    RefreshCwIcon,
    Square,
    Image,
    FileText,
    BookOpen,
    Presentation,
} from "lucide-react";

import {
    ActionBarPrimitive,
    BranchPickerPrimitive,
    ComposerPrimitive,
    ErrorPrimitive,
    MessagePrimitive,
    ThreadPrimitive,
} from "@assistant-ui/react";

import type { FC } from "react";
import {useRef, useState} from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { Reasoning, ReasoningGroup } from "@/components/assistant-ui/reasoning";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
    ComposerAddAttachment,
    ComposerAttachments,
    UserMessageAttachments,
} from "@/components/assistant-ui/attachment";

import { cn } from "@/lib/utils";

export const Thread: FC = () => {
    return (
        <LazyMotion features={domAnimation}>
            <MotionConfig reducedMotion="user">
                <ThreadPrimitive.Root
                    className="aui-root aui-thread-root @container flex h-full flex-col bg-background"
                    style={{
                        ["--thread-max-width" as string]: "44rem",
                    }}
                >
                    <ThreadPrimitive.Viewport className="aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll px-4">
                        <ThreadPrimitive.If empty>
                            <ThreadWelcome />
                        </ThreadPrimitive.If>

                        <ThreadPrimitive.Messages
                            components={{
                                UserMessage,
                                EditComposer,
                                AssistantMessage,
                            }}
                        />

                        <ThreadPrimitive.If empty={false}>
                            <div className="aui-thread-viewport-spacer min-h-8 grow" />
                        </ThreadPrimitive.If>

                        <Composer />
                    </ThreadPrimitive.Viewport>
                </ThreadPrimitive.Root>
            </MotionConfig>
        </LazyMotion>
    );
};

const ThreadScrollToBottom: FC = () => {
    return (
        <ThreadPrimitive.ScrollToBottom asChild>
            <TooltipIconButton
                tooltip="Shko në fund"
                variant="outline"
                className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:bg-background dark:hover:bg-accent"
            >
                <ArrowDownIcon />
            </TooltipIconButton>
        </ThreadPrimitive.ScrollToBottom>
    );
};

const ThreadWelcome: FC = () => {
    return (
        <div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
            <div className="aui-thread-welcome-center flex w-full flex-grow flex-col items-center justify-center">
                <div className="aui-thread-welcome-message flex w-full flex-col justify-center px-8 items-center">
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="aui-thread-welcome-message-motion-1 text-2xl font-semibold"
                    >
                        Përshëndetje, si mund t'ju ndihmoj?
                    </m.div>
                </div>
            </div>
            <ThreadSuggestions />
        </div>
    );
};

const suggestions = [
  { title: "/img", label: "Gjenero një imazh", icon: Image, icon_color: "#3b82f6" },
  { title: "/tns", label: "Përkthe një fjalë, fjali ose tekst", icon: FileText, icon_color: "#10b981" },
  { title: "/ppt", label: "Krijo një prezantim", icon: Presentation, icon_color: "#ed3e12" },
  { title: "Zgjidh ushtrimin:", label: "Zgjidh ushtrime te cdo lende dhe veshtiresie", icon: BookOpen, icon_color: "#a855f7" },
];

export const ThreadSuggestions: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount = container.offsetWidth * 0.8; // scroll 80% of container width
    const newPos = direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: newPos, behavior: "smooth" });
    setScrollPosition(newPos);
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-200 p-2 shadow hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        ◀
      </button>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-4 pl-10 pr-10"
      >
        {suggestions.map((s, index) => {
          const Icon = s.icon;
          return (
            <m.div
              key={s.title + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="min-w-[200px] flex-shrink-0 scroll-m-2"
            >
              <ThreadPrimitive.Suggestion prompt={s.title} asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-full flex-col items-start gap-1 rounded-3xl border px-5 py-4 text-left text-sm hover:bg-accent/30 dark:hover:bg-accent/40"
                  aria-label={s.title}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Icon size={16} style={{ color: s.icon_color ?? "hsl(var(--muted-foreground))" }} />
                    {s.title}
                  </span>
                  <span className="text-muted-foreground">{s.label}</span>
                </Button>
              </ThreadPrimitive.Suggestion>
            </m.div>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-200 p-2 shadow hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        ▶
      </button>
    </div>
  );
};

const Composer: FC = () => {
    return (
        <div className="aui-composer-wrapper sticky bottom-0 mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6">
            <ThreadScrollToBottom />
            <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
                <ComposerPrimitive.AttachmentDropzone className="aui-composer-attachment-dropzone group/input-group flex w-full flex-col rounded-3xl border border-input bg-background px-1 pt-2 shadow-xs transition-[color,box-shadow] outline-none has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:ring-[3px] has-[textarea:focus-visible]:ring-ring/50 data-[dragging=true]:border-dashed data-[dragging=true]:border-ring data-[dragging=true]:bg-accent/50 dark:bg-background">
                    <ComposerAttachments />
                    <ComposerPrimitive.Input
                        placeholder="Dërgo një mesazh"
                        className="aui-composer-input mb-1 max-h-32 min-h-16 w-full resize-none bg-transparent px-3.5 pt-1.5 pb-3 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-0"
                        rows={1}
                        autoFocus
                        aria-label="Dërgo një mesazh"
                    />
                    <ComposerAction />
                </ComposerPrimitive.AttachmentDropzone>
            </ComposerPrimitive.Root>
        </div>
    );
};

const ComposerAction: FC = () => {
    return (
        <div className="aui-composer-action-wrapper relative mx-1 mt-2 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ComposerAddAttachment />
            </div>

            <div className="flex items-center gap-2">
                <ThreadPrimitive.If running={false}>
                    <ComposerPrimitive.Send asChild>
                        <TooltipIconButton
                            tooltip="Dërgo mesazhin"
                            side="bottom"
                            type="submit"
                            variant="default"
                            size="icon"
                            className="aui-composer-send size-[34px] rounded-full p-1"
                            aria-label="Dërgo mesazhin"
                        >
                            <ArrowUpIcon className="aui-composer-send-icon size-5" />
                        </TooltipIconButton>
                    </ComposerPrimitive.Send>
                </ThreadPrimitive.If>

                <ThreadPrimitive.If running>
                    <ComposerPrimitive.Cancel asChild>
                        <TooltipIconButton
                            tooltip="Ndalo gjenerimin"
                            side="bottom"
                            variant="default"
                            size="icon"
                            className="aui-composer-cancel size-[34px] rounded-full p-1"
                            aria-label="Ndalo gjenerimin"
                        >
                            <Square className="aui-composer-cancel-icon size-3.5 fill-white" />
                        </TooltipIconButton>
                    </ComposerPrimitive.Cancel>
                </ThreadPrimitive.If>
            </div>
        </div>
    );
};

// Thread Components
const MessageError: FC = () => {
    return (
        <MessagePrimitive.Error>
            <ErrorPrimitive.Root className="aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/5 dark:text-red-200">
                <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
            </ErrorPrimitive.Root>
        </MessagePrimitive.Error>
    );
};

const AssistantMessage: FC = () => {
    return (
        <MessagePrimitive.Root asChild>
            <div
                className="aui-assistant-message-root relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
                data-role="assistant"
            >
                <div className="aui-assistant-message-content mx-2 leading-7 break-words text-foreground">
                    <MessagePrimitive.Parts
                        components={{
                            Text: MarkdownText,
                            Reasoning: Reasoning,
                            ReasoningGroup: ReasoningGroup,
                            tools: { Fallback: ToolFallback },
                        }}
                    />
                    <MessageError />
                </div>

                <div className="aui-assistant-message-footer mt-2 ml-2 flex">
                    <BranchPicker />
                    <AssistantActionBar />
                </div>
            </div>
        </MessagePrimitive.Root>
    );
};

const AssistantActionBar: FC = () => {
    return (
        <ActionBarPrimitive.Root
            hideWhenRunning
            autohide="not-last"
            autohideFloat="single-branch"
            className="aui-assistant-action-bar-root col-start-3 row-start-2 -ml-1 flex gap-1 text-muted-foreground data-floating:absolute data-floating:rounded-md data-floating:border data-floating:bg-background data-floating:p-1 data-floating:shadow-sm"
        >
            <ActionBarPrimitive.Copy asChild>
                <TooltipIconButton tooltip="Kopjo">
                    <MessagePrimitive.If copied>
                        <CheckIcon />
                    </MessagePrimitive.If>
                    <MessagePrimitive.If copied={false}>
                        <CopyIcon />
                    </MessagePrimitive.If>
                </TooltipIconButton>
            </ActionBarPrimitive.Copy>
            <ActionBarPrimitive.Reload asChild>
                <TooltipIconButton tooltip="Rifrsko">
                    <RefreshCwIcon />
                </TooltipIconButton>
            </ActionBarPrimitive.Reload>
        </ActionBarPrimitive.Root>
    );
};

const UserMessage: FC = () => {
    return (
        <MessagePrimitive.Root asChild>
            <div
                className="aui-user-message-root mx-auto grid w-full max-w-[var(--thread-max-width)] animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 px-2 py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 first:mt-3 last:mb-5 [&:where(>*)]:col-start-2"
                data-role="user"
            >
                <UserMessageAttachments />

                <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
                    <div className="aui-user-message-content rounded-3xl bg-muted px-5 py-2.5 break-words text-foreground">
                        <MessagePrimitive.Parts />
                    </div>
                    <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2">
                        <UserActionBar />
                    </div>
                </div>

                <BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
            </div>
        </MessagePrimitive.Root>
    );
};

const UserActionBar: FC = () => {
    return (
        <ActionBarPrimitive.Root
            hideWhenRunning
            autohide="not-last"
            className="aui-user-action-bar-root flex flex-col items-end"
        >
            <ActionBarPrimitive.Edit asChild>
                <TooltipIconButton tooltip="Ndrysho" className="aui-user-action-edit p-4">
                    <PencilIcon />
                </TooltipIconButton>
            </ActionBarPrimitive.Edit>
        </ActionBarPrimitive.Root>
    );
};

const EditComposer: FC = () => {
    return (
        <div className="aui-edit-composer-wrapper mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 px-2 first:mt-4">
            <ComposerPrimitive.Root className="aui-edit-composer-root ml-auto flex w-full max-w-7/8 flex-col rounded-xl bg-muted">
                <ComposerPrimitive.Input
                    className="aui-edit-composer-input flex min-h-[60px] w-full resize-none bg-transparent p-4 text-foreground outline-none"
                    autoFocus
                />

                <div className="aui-edit-composer-footer mx-3 mb-3 flex items-center justify-center gap-2 self-end">
                    <ComposerPrimitive.Cancel asChild>
                        <Button variant="ghost" size="sm" aria-label="Cancel edit">
                            Ndalo
                        </Button>
                    </ComposerPrimitive.Cancel>
                    <ComposerPrimitive.Send asChild>
                        <Button size="sm" aria-label="Update message">
                            Ndrysho
                        </Button>
                    </ComposerPrimitive.Send>
                </div>
            </ComposerPrimitive.Root>
        </div>
    );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
    className,
    ...rest
}) => {
    return (
        <BranchPickerPrimitive.Root
            hideWhenSingleBranch
            className={cn(
                "aui-branch-picker-root mr-2 -ml-2 inline-flex items-center text-xs text-muted-foreground",
                className
            )}
            {...rest}
        >
            <BranchPickerPrimitive.Previous asChild>
                <TooltipIconButton tooltip="Para">
                    <ChevronLeftIcon />
                </TooltipIconButton>
            </BranchPickerPrimitive.Previous>
            <span className="aui-branch-picker-state font-medium">
                <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
            </span>
            <BranchPickerPrimitive.Next asChild>
                <TooltipIconButton tooltip="Pas">
                    <ChevronRightIcon />
                </TooltipIconButton>
            </BranchPickerPrimitive.Next>
        </BranchPickerPrimitive.Root>
    );
};
