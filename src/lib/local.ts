import { inject } from "vue"
import { Watcher } from "../types"

export function useLSWatcher():Watcher {
    return inject("$ls")!
}