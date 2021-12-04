import { inject } from "vue"
import { Watcher } from "../types"
export const localSymbol = "$ls"
export function useLSWatcher():Watcher {
    return inject(localSymbol)!
}