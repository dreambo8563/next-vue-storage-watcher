import { App, reactive, readonly, Ref, toRef } from "vue";
import { Watcher, WatcherOptions } from "../types";
import { parserStorageObj, storageRefFactory } from "./utils";
export {useLSWatcher} from "./local"
export {useSSWatcher} from "./session"

const lsSymbol = "_LS_Watcher_"
const UpdateSymbol ="$$_UKEY_$$"
const storageInstantce={
    "local":localStorage,
    "session":sessionStorage
}
declare type  watcherType = "local"|"session"

export function createWatcher(options?: WatcherOptions): Watcher {
    const prefix = options?.prefix
    const storage = options?.storage ?? "local"

return watcherFactory(prefix,storage)
   
}

function watcherFactory(prefix:string|undefined, storage:watcherType) : Watcher{
    return createStorageWatcher(prefix,storage)
   
}

export function createStorageWatcher(p:string|undefined,s:watcherType) {
    const storage = storageInstantce[s]
    const storageRef = storageRefFactory(storage)
    const keys = Object.keys(storage)
    let obj ={} as Record<string,Ref<any>>
    const prefix = p||lsSymbol //combined prefix
    for (const k of keys) {
        if (k.startsWith(prefix)){
            const originKeyName = k.replace(prefix, "")
            // keys managed by watcher
            obj[originKeyName]=storageRef({
                content:{
                    value:storageRef(parserStorageObj(k,storage))
                },
            })
        }
    }
    const reactiveStorage = reactive(obj) 

    const watcher:Watcher = {
        
        
        install(app:App){
            const w = this
            app.config.globalProperties.$watcher = w
            app.provide("$ls", w)
        },
        
        setItem(key:string,value:any,expire: any=null): void{
            if (reactiveStorage[key]==undefined){
                reactiveStorage[key] = storageRef({
                    content:{
                        value:storageRef({
                            value:null,
                            expire:null
                        })
                    },
                })              
            }
            // trigger the value change
            reactiveStorage[key].content.value.value=JSON.stringify({
                value,
                key,
                prefix,
                expire,
                action:UpdateSymbol
            })
        },
        
        getItem(key:string,defaultValue: any=null){
             if (reactiveStorage[key]==undefined){
                 // the key is not existed
                reactiveStorage[key] = storageRef({
                    content:{
                        value:storageRef({
                            value:defaultValue,
                            expire:null
                        })
                    }
                })
            
            }
        // mark it as readonly, to avoid the usage like message.value="hello"
        // we just support setItem to update value
         return readonly(toRef(reactiveStorage[key].content?.value,"value"))
        },
        
        removeItem(key:string):void{
            // trigger the change 
            if (reactiveStorage[key]?.content?.value?.value){
                reactiveStorage[key].content.value.value=null
            }
       
            delete reactiveStorage?.[key]
            storage.removeItem(prefix+key)
        },
        
        clear():void{
            for (const key in reactiveStorage) {
                this.removeItem(key)
            }
        }
    }

    return watcher
}