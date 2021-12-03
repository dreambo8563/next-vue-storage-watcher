import {inject } from "vue"
import { Watcher } from "../types"

  export function useSSWatcher():Watcher {
    return inject("$ss")!
}