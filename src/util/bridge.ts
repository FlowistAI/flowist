
declare global {
    interface Window {
        api?: {
            client: string;
        };
    }
}

export function isDesktop() {
    return window.api?.client === "electron";
}
