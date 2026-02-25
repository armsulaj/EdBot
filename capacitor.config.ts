import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.edbot.app",
    appName: "EdBot",
    webDir: "www",
    server: {
        url: "https://ed-bot-cyan.vercel.app/",
        cleartext: false,
    },
    android: {
        backgroundColor: "#0A0A14",
        allowMixedContent: false,
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: "#0A0A14",
            androidScaleType: "CENTER_INSIDE",
            showSpinner: false,
            splashFullScreen: true,
            splashImmersive: true,
        },
    },
};

export default config;
