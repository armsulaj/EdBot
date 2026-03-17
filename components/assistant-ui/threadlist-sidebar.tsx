"use client";

import * as React from "react";
import { SettingsIcon, Sun, Moon, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

// Theme System

type Theme = {
    name: string;
    primary: string;
};

const themes: Theme[] = [
    { name: "Red", primary: "#F53434" },
    { name: "Blue", primary: "#3b82f6" },
    { name: "Green", primary: "#22c55e" },
    { name: "Purple", primary: "#a855f7" },
    { name: "Orange", primary: "#f97316" },
    { name: "Teal", primary: "#14b8a6" },
    { name: "Pink", primary: "#ec4899" },
    { name: "Yellow", primary: "#eab308" },
    { name: "Cyan", primary: "#06b6d4" },
    { name: "Lime", primary: "#84cc16" },
    { name: "Rose", primary: "#f43f5e" },
    { name: "Indigo", primary: "#6366f1" },
];

// Color Palettes

const darkBase: Record<string, string> = {
    "--background": "#0A0A14",
    "--foreground": "#FFFFFF",
    "--card": "#151521",
    "--card-foreground": "#FFFFFF",
    "--popover": "#151521",
    "--popover-foreground": "#FFFFFF",
    "--secondary": "#1E1E2D",
    "--secondary-foreground": "#E2E2E2",
    "--muted": "#1E1E2D",
    "--muted-foreground": "#8A8A9D",
    "--accent": "#151521",
    "--accent-foreground": "#FFFFFF",
    "--destructive": "#a79898",
    "--border": "#2D2D3D",
    "--sidebar": "#151521",
    "--sidebar-foreground": "#E2E2E2",
    "--sidebar-border": "#2D2D3D",
};

const lightBase: Record<string, string> = {
    "--background": "#FFFFFF",
    "--foreground": "#0A0A14",
    "--card": "#F6F6FB",
    "--card-foreground": "#0A0A14",
    "--popover": "#F6F6FB",
    "--popover-foreground": "#0A0A14",
    "--secondary": "#EAEAF3",
    "--secondary-foreground": "#0A0A14",
    "--muted": "#EAEAF3",
    "--muted-foreground": "#5A5A70",
    "--accent": "#F6F6FB",
    "--accent-foreground": "#0A0A14",
    "--destructive": "#a79898",
    "--border": "#D6D6E4",
    "--sidebar": "#F6F6FB",
    "--sidebar-foreground": "#0A0A14",
    "--sidebar-border": "#D6D6E4",
};

// Apply Theme Engine

function applyTheme({
    primary,
    mode,
}: {
    primary: string;
    mode: "dark" | "light";
}) {
    const root = document.documentElement;
    const base = mode === "dark" ? darkBase : lightBase;

    Object.entries(base).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    root.style.setProperty("--primary", primary);
    root.style.setProperty("--primary-foreground", "#FFFFFF");
    root.style.setProperty("--input", primary);
    root.style.setProperty("--ring", primary);
    root.style.setProperty("--sidebar-primary", primary);
    root.style.setProperty("--sidebar-primary-foreground", "#FFFFFF");
    root.style.setProperty("--sidebar-accent", primary);
    root.style.setProperty("--sidebar-accent-foreground", "#FFFFFF");
    root.style.setProperty("--sidebar-ring", primary);
}

// Theme Carousel

function ThemeCarousel({
    index,
    setIndex,
}: {
    index: number;
    setIndex: (i: number) => void;
}) {
    return (
        <div className="w-full flex flex-col items-center mt-4">
            <div className="grid grid-cols-6 gap-3">
                {themes.map((theme, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        style={{ backgroundColor: theme.primary }}
                        className={`w-11 h-11 rounded-full transition-transform hover:scale-110 ${i === index ? "ring-4 ring-offset-2 ring-white" : ""
                            }`}
                        title={theme.name}
                    />
                ))}
            </div>
        </div>
    );
}

// Light Mode Toggle

function LightModeToggle({
    mode,
    setMode,
}: {
    mode: "dark" | "light";
    setMode: (m: "dark" | "light") => void;
}) {
    const isLight = mode === "light";

    return (
        <div className="mt-4 flex flex-col items-center w-full px-2">
            <span className="text-sm font-medium mb-1 text-center w-full">
                {isLight ? "Toggle Dark Mode" : "Toggle Light Mode"}
            </span>

            <button
                onClick={() => setMode(isLight ? "dark" : "light")}
                className="relative h-8 w-16 rounded-full transition-colors duration-300 flex items-center bg-muted"
            >
                <span
                    className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-primary shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center text-white text-lg ${isLight ? "translate-x-0" : "translate-x-8"
                        }`}
                >
                    {isLight ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </span>
            </button>
        </div>
    );
}

// LOGOUT BUTTON WITH CONFIRMATION

function LogoutButton() {
    const [loading, setLoading] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="group relative flex items-center gap-2"
                    >
                        <LogOut className="aui-sidebar-settings-icon size-4 text-red-500 group-hover:text-red-400 transition-colors" />
                        <div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none">
                            <span>Shkyçu</span>
                        </div>
                    </SidebarMenuButton>
                </DialogTrigger>

                <DialogContent className="p-4 max-w-sm rounded-xl bg-background border border-border flex flex-col gap-4 items-center text-center">
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        Konfirmo Shkyçjen
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        A jeni të sigurt që dëshironi të dilni nga EdBot?
                    </p>

                    <div className="flex gap-4 mt-2 w-full">
                        <button
                            className="flex-1 rounded-2xl border border-red-500 bg-red-600 py-2 text-white font-bold hover:bg-red-500 active:scale-[0.98] transition-all"
                            onClick={handleLogout}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            ) : (
                                "Po, Dil"
                            )}
                        </button>
                        <button
                            className="flex-1 rounded-2xl border border-muted bg-muted py-2 text-foreground font-bold hover:bg-muted/80 active:scale-[0.98] transition-all"
                            onClick={() => setConfirmOpen(false)}
                            disabled={loading}
                        >
                            Jo, Anulo
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Main Sidebar

export function ThreadListSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const [mounted, setMounted] = React.useState(false);
    const [themeIndex, setThemeIndex] = React.useState(0);
    const [mode, setMode] = React.useState<"dark" | "light">("dark");

    React.useEffect(() => {
        setMounted(true);

        const savedTheme = localStorage.getItem("edbot-theme-index");
        const savedMode = localStorage.getItem("edbot-color-mode");

        const themeIdx =
            savedTheme && themes[Number(savedTheme)]
                ? Number(savedTheme)
                : 0;

        const colorMode =
            savedMode === "light" || savedMode === "dark"
                ? savedMode
                : "dark";

        setThemeIndex(themeIdx);
        setMode(colorMode);

        applyTheme({
            primary: themes[themeIdx].primary,
            mode: colorMode,
        });
    }, []);

    React.useEffect(() => {
        if (!mounted) return;

        applyTheme({
            primary: themes[themeIndex].primary,
            mode,
        });

        localStorage.setItem("edbot-theme-index", String(themeIndex));
        localStorage.setItem("edbot-color-mode", mode);
    }, [themeIndex, mode, mounted]);

    return (
        <Sidebar {...props}>
            <SidebarHeader className="aui-sidebar-header mb-2 border-b">
                <div className="aui-sidebar-header-content flex items-center justify-between">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="https://raw.githubusercontent.com/armsulaj/EdBot/main/logo.png"
                                            alt="EdBot-Logo"
                                            className="h-8 w-8"
                                        />
                                        <div className="aui-sidebar-header-heading flex flex-col gap-0.5 leading-none">
                                            <span className="aui-sidebar-header-title font-semibold">
                                                EdBot
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarHeader>

            <SidebarContent className="aui-sidebar-content px-2">
                <ThreadList />
            </SidebarContent>

            <SidebarRail />

            <SidebarFooter className="aui-sidebar-footer border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        {mounted ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <SidebarMenuButton size="lg">
                                        <div className="flex items-center gap-2">
                                            <SettingsIcon className="aui-sidebar-settings-icon size-4" />
                                            <div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none">
                                                <span>Cilësimet</span>
                                            </div>
                                        </div>
                                    </SidebarMenuButton>
                                </DialogTrigger>

                                <DialogContent className="p-2 sm:max-w-3xl [&_svg]:text-background [&>button]:rounded-full [&>button]:bg-foreground/70 [&>button]:p-1 [&>button]:opacity-100 [&>button]:!ring-0 [&>button]:hover:[&_svg]:text-destructive">
                                    <DialogTitle className="sr-only">Personalizo</DialogTitle>

                                    <div className="relative mx-auto flex max-h-[80dvh] w-full flex-col items-center bg-background rounded-xl p-4 gap-4">
                                        <p className="inline-block border-b border-gray-300 pb-1 text-center">
                                            Personalizo
                                        </p>

                                        <ThemeCarousel
                                            index={themeIndex}
                                            setIndex={setThemeIndex}
                                        />

                                        <p className="inline-block border-b border-gray-300 pb-1 text-center">
                                            Sfondi
                                        </p>

                                        <LightModeToggle mode={mode} setMode={setMode} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <SidebarMenuButton size="lg">
                                <div className="flex items-center gap-2">
                                    <SettingsIcon className="aui-sidebar-settings-icon size-4" />
                                    <div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none">
                                        <span>Cilësimet</span>
                                    </div>
                                </div>
                            </SidebarMenuButton>
                        )}
                        {/* LOGOUT BUTTON */}
                        <SidebarMenuItem>
                        <LogoutButton />
                    </SidebarMenuItem>
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}