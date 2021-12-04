import { customRef } from "vue";

export function parserStorageObj(k:string,s:Storage) {
    const c = s.getItem(k)
    if (c==null){
        return null
    }
  try {
      const data = JSON.parse(c);

    return data
   
    } catch {
      return null;
    }
}


export function calcExpireTime(expire:number) {
    return new Date().getTime() + expire
}
export const stringifyValue =(payload:any,expire=null)=> {
    return JSON.stringify({
        value: payload,
        expire: expire !== null ? calcExpireTime(expire) : null
      })
};

export function storageRefFactory(s:Storage){
    return function useStorageRef(value:any) {
        return customRef((track, trigger) => {
          return {
            get() {
              track()
              return value
            },
            set(newValue) {
                if (newValue ==null){
                    value = {
                        value:null,
                        expire:null
                    }
                }else{
                    try {
                        const obj = JSON.parse(newValue as string)
    
                            value = {
                                value:obj?.value??null,
                                expire:calcExpireTime(obj.expire)
                            }
                            obj&&  s.setItem(obj.prefix+obj.key,stringifyValue(obj.value,obj.expire))
                        
                    } catch (error) {
                        console.error(error);
                        value = newValue
                    }
                }
                trigger()
            }
          }
        })
      }
}
