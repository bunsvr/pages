import { Router } from "@stricjs/router";
import Path from "path/posix";
import Bun from "bun";
import { App } from "@stricjs/core";

/**
 * A page router template
 */
export abstract class PageRouter<T = any> {
    /**
     * Source dir relative path 
     */
    readonly src!: string;

    /**
     * Output dir relative path 
     */
    readonly out!: string;

    /**
     * Development mode
     */
    readonly dev!: boolean;

    /**
     * Root dir absolute path
     */
    readonly root!: string;

    /**
     * The page router
     */
    readonly router!: Router<T>;

    /**
     * The page app
     */
    readonly app!: App<T>;

    /**
     * Create a page router
     */
    constructor() {
        this.root = Path.resolve();
        this.src = "src";
        this.out = "out";
        this.dev = Bun.env.NODE_ENV !== "production";

        this.app = new App<T>;
        this.router = new Router<T>;
    }

    /**
     * Set source dir relative path
     * @param field 
     * @param value 
     */
    set(field: "src", value: string): this;

    /**
     * Set out dir relative path
     * @param field 
     * @param value 
     */
    set(field: "out", value: string): this;

    /**
     * Set root dir absolute path
     * @param field 
     * @param value 
     */
    set(field: "root", value: string): this;

    /**
     * Set development mode
     * @param field 
     * @param value 
     */
    set(field: "dev", value: boolean): this;

    /**
     * Set the router
     * @param field 
     * @param value 
     */
    set(field: "router", value: Router<T>): this;

    /**
     * Set a readonly property
     * @param field 
     * @param value 
     */
    set(field: string, value: any) {
        // @ts-ignore
        this[field] = value;

        return this;
    };

    /**
     * Route a static page
     * @param path The pathname 
     * @param source Relative path in src
     */
    abstract static(path: string, source: string, ssr?: boolean): this;

    /**
     * Route a dynamic page
     * @param path The pathname 
     * @param source Relative path in src
     */
    abstract dynamic(path: string | RegExp, source: string, ssr?: boolean): this;

    /**
     * Build all files in src and add all routes to app
     */
    abstract load(streamOpts?: BlobPropertyBag & ResponseInit): Promise<this>;

    /**
     * Serve the app
     */
    async serve() {
        await this.load();
        return Bun.serve(this.app);
    }

    /**
     * Return the fetch handler
     */
    fetch(): (request: Request<any>, server: Bun.Server) => Promise<Response> {
        return this.app.fetch.bind(this.app);
    }
}