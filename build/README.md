TODO: 必要なexport文のみを使用してtree shakingする（現在2.5MB）

```shell
> cd ./build
> npm i
> npx esbuild ./target.mjs --bundle --minify --format=esm --outfile=./superfluid.js
```
