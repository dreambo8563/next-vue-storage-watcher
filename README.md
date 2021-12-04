[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Known Vulnerabilities](https://snyk.io/test/github/dreambo8563/next-vue-storage-watcher/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dreambo8563/next-vue-storage-watcher?targetFile=package.json)
![npm type definitions](https://img.shields.io/npm/types/next-vue-storage-watcher.svg?style=flat)
![npm](https://img.shields.io/npm/dt/next-vue-storage-watcher.svg?style=flat)

# Next-vue-storage-watcher

![](https://raw.githubusercontent.com/dreambo8563/static-assets/master/watcher1.png)

## Vue 3 version (vue 2 pls refer to [here](https://github.com/dreambo8563/vue-storage-watcher))
the real reactive watcher for localStorge.
I search a few days for a lib to watch the ls, but failed.

you can use this tiny storage wrapper which works well with vue.js.

- reactive
- type supported
- small size

TODO:

- [x] make expire params work
- [x] provide info method

## Install

> npm install next-vue-storage-watcher --save


## Sample

```ts
import { createApp } from 'vue'
import { createWatcher }from 'next-vue-storage-watcher';

export const lsWatcher = createWatcher({
    prefix:"test_ls_"
})

export const ssWatcher =createWatcher({
    prefix:"test_ss_",
    storage:"session"
})

createApp(App)
    .use(lsWatcher)
    .use(ssWatcher)
    .mount('#app')
```

> storage type

- localStorage
- sessionStorage

## Options

- prefix => default is "_Storage_Watcher_"
- storage => default is "local" which means window.localStorage will be used as Storage Object. Another alternative is "session"

## Methods

### Usage in setup 
```ts
import { useLSWatcher } from "next-vue-storage-watcher";
import { useSSWatcher } from "next-vue-storage-watcher";

const ls = useLSWatcher()
const ss = useSSWatcher()
```

### Usage outside setup

- main.ts
```ts
export const lsWatcher = createWatcher({
    prefix:"test_ls_"
})
```

- user.ts
```ts
import { lsWatcher as ls } from "../main";

const msg = ls.getItem("msg");
```

> I will list basic api just with ls.

### setItem

```ts
ls.setItem("token","jwt")
```

the value will be saved in storage with the **prefix** + key

> you also can give the key an expire duration with the unit of (**ms**) `(Not Completed!!)`

```ts 
ls.setItem("token","jwt",3000)
```

the key will be expried in 3s, you will get null after that.

### info

info will return `{value:"",expire:null} `

the value prop is `reactive`, the expire is `**NOT** reactive`, just the snapshot of that second

expire will be **null** if one of the following scenarios happen:

- the key is non-exist
- the key is already expired
- the key has no expire time

```ts
ls.info('token');
```

### getItem


```ts
ls.getItem('token', 'default');
```

get the value with a default return value if it's not existed

> the returned value is Ref<any>, you just use it as other Ref values in Vue 3.


### removeItem

```ts
ls.removeItem('token');
```

remove will delete the key in storage and emit with **null** value

### clear

```ts
ls.clear();
```

delete all the keys with your **prefix**. and all the value will be**null** 


### FAQ

- pls **NOT** to set value as following, the correct way is to use setItem
```ts
const ls = useLSWatcher()

let msg = ls.getItem("msg")
msg.value = "new msg" // !!!you will receive a warning
```


## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/6948318?v=4" width="100px;" alt="Vincent Guo"/><br /><sub><b>Vincent Guo</b></sub>](https://dreambo8563.github.io/)<br />[💻](https://github.com/dreambo8563/next-vue-storage-watcher/commits?author=dreambo8563 "Code") [📖](https://github.com/dreambo8563/next-vue-storage-watcher/commits?author=dreambo8563 "Documentation") [🐛](https://github.com/dreambo8563/next-vue-storage-watcher/issues?q=author%3Adreambo8563 "Bug reports") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
