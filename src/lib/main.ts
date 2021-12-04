import { App, reactive, readonly, Ref, toRef, watchEffect } from "vue";
import { Watcher, WatcherOptions } from "../types";
import { localSymbol } from "./local";
import { sessionSymbol } from "./session";
import { calcExpireTime, parserStorageObj, storageRefFactory } from "./utils";
export {useLSWatcher} from "./local"
export {useSSWatcher} from "./session"

const defaultPrefix = "_Storage_Watcher_"
const UpdateSymbol ="$$_UKEY_$$"


const storageSymbol = {
    "local":localSymbol,
    "session":sessionSymbol
}
const storageInstantce={
    "local":localStorage,
    "session":sessionStorage
}
declare type  watcherType = "local"|"session"
const defaultType:watcherType ="local"

export function createWatcher(options?: WatcherOptions): Watcher {
    const prefix = options?.prefix
    const storage = options?.storage || defaultType

return watcherFactory(prefix,storage)
   
}

function watcherFactory(prefix:string|undefined, storage:watcherType) : Watcher{
    return createStorageWatcher(prefix,storage)
   
}

export function createStorageWatcher(p:string|undefined,s:watcherType) {
    const storage = storageInstantce[s]

    const prefix = p||defaultPrefix //combined prefix
    const storageRef = storageRefFactory(storage);
    const [reactiveStorage,reactiveExpire] = initReactiveObject(prefix,storage,storageRef);

    let timerHanlder:number | undefined = undefined

    watchEffect(()=>{
        const min = Math.min(...Object.values(reactiveExpire))

        // any changes happen, just stop the timer firstly
         window.clearInterval(timerHanlder)
        if(min==Infinity){
            // no expire values, stop the time and clear handler
            timerHanlder = undefined
            
        }else{
            // found expire value
            const interval = min-(new Date()).getTime() 
            timerHanlder = window.setTimeout(()=>{
                for (const key in reactiveExpire) {
                    if(reactiveExpire[key]===min){
                        innerRemoveMethod(storage,key,prefix,reactiveStorage)
                        delete reactiveExpire[key]
                    }
                }

            },Math.max(0,interval))
        }
    })

    const watcher:Watcher = {
        install(app:App){
            const w = this
            app.config.globalProperties.$watcher = w
            app.provide(storageSymbol[s], w)
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
            if(expire==null){
                delete reactiveExpire[key]
            }else{
                reactiveExpire[key] = calcExpireTime(expire)
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
        info(key:string){
            if (reactiveStorage[key]==undefined){
                // the key is not existed
               reactiveStorage[key] = storageRef({
                   content:{
                       value:storageRef({
                           value:null,
                           expire:null
                       })
                   }
               })
           
           }
        return readonly(toRef(reactiveStorage[key].content,"value"))
       },
        
       removeItem(key:string):void {
        innerRemoveMethod(storage,key,prefix,reactiveStorage)
       },
        
        clear():void{
            for (const key in reactiveStorage) {
                this.removeItem(key)
            }
        }
    }

    return watcher
}
function innerRemoveMethod(storage:Storage,key:string,prefix:string, reactiveStorage:any) {
    // trigger the change 
    if (reactiveStorage[key]?.content?.value?.value){
        reactiveStorage[key].content.value.value=null
    }

    delete reactiveStorage?.[key]
    storage.removeItem(prefix+key)
}

function initReactiveObject(prefix:string,storage:Storage,storageRef:(value:any)=>Ref<unknown>) {
    const keys = Object.keys(storage)
    let obj ={} as Record<string,Ref<any>>
    let expireObj = {} as Record<string,number>

    for (const k of keys) {
        if (k.startsWith(prefix)){
            const originKeyName = k.replace(prefix, "")
            const parsed = parserStorageObj(k,storage)
            if (parsed.expire !=null){
                expireObj[originKeyName] = parseInt(parsed.expire)
            }
            // keys managed by watcher
            obj[originKeyName]=storageRef({
                content:{
                    value:storageRef(parsed)
                },
            })
        }
    }
    return [reactive(obj) ,reactive(expireObj)]
}