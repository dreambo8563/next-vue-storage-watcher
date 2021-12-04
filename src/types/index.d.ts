import { App, Ref } from "vue";

export interface Watcher{
    /**
     *install method as register the plugin
     *
     * @param {App} app
     */
    install(app: App): void
    /**
     *
     * @param {string} key
     * @param {*} [defaultValue=null] return defaultValue if the key not exist
     * @returns
     */
    getItem(key:string,defaultValue?:any):Ref<any>
    

    /**
     *
     *
     * @param {string} key 
     * @param {*} value
     * @param {*} [expire=null] unit: ms
     */
    setItem(key:string,value:any,expire?:number):void
    /**
     *
     *
     * @param {string} key
     * @returns {({value:any,expire:number|null})}
     * @memberof Watcher
     */
     info(key:string):{value:any,expire:number|null}
    
    /**
     *
     *  remove the key
     * @param {string} key 
     * @memberof Watcher
     */
    removeItem(key:string):void
    /**
     *clear all keys which the watcher managed
     *
     */
    clear():void
}

export interface WatcherOptions {
    prefix?:string,
    storage?:"local" | "session"
}
export function createWatcher(options?: WatcherOptions): Watcher;
export function useLSWatcher():Watcher 
export function useSSWatcher():Watcher