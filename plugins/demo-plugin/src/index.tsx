import { Counter } from "./Counter";

interface NeuflowPlugin {
    name: string;
    description: string;
    version: string;
    component: React.ComponentType;
}

interface PluginBridge {
    register: (plugin: NeuflowPlugin) => void;
}

interface Window {
    pluginBridge: PluginBridge;
}

(window as unknown as Window).pluginBridge.register({
    name: "My Plugin",
    description: "This is my plugin",
    version: "1.0.0",
    component: Counter,
});
