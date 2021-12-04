import {inject } from "vue"
import { Watcher } from "../types"
export const sessionSymbol="$ss"
  export function useSSWatcher():Watcher {
    return inject(sessionSymbol)!
}