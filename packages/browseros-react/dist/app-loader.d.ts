import type React from "react";
import { type AppManifest } from "@browseros/core";
interface AppLoaderProps {
    app: AppManifest;
    fallback?: React.ReactNode;
}
export declare function AppLoader({ app, fallback }: AppLoaderProps): import("react/jsx-runtime").JSX.Element;
export {};
