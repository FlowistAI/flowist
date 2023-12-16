import { ComponentType, FC, PropsWithChildren, forwardRef } from "react";

export type Component<T = Required<PropsWithChildren>> =
    | ComponentType<T>
    | ReturnType<typeof forwardRef>
    | [ComponentType<T>, Omit<T, "children">]
    | [ReturnType<typeof forwardRef>, Omit<T, "children">];

export type Provider = Component;

type ComponentProps = {
    components: Component[];
    providers?: never;
};

type ProviderProps = {
    providers: Provider[];
    components?: never;
};

type Compose = (ComponentProps | ProviderProps) & Required<PropsWithChildren<unknown>>

export const Compose: FC<Compose> = ({ children, components, providers }) => {
    components = components || providers;
    return (
        <>
            {components.reverse().reduce((acc, curr) => {
                const [Provider, props] = Array.isArray(curr)
                    ? [curr[0], curr[1]]
                    : [curr, {}];

                return <Provider {...props}>{acc}</Provider>;
            }, children)}
        </>
    );
};
