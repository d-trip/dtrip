## [dtrip.app](https://dtrip.app)

![DTrip app](https://imgur.com/download/gMUtR4O)


Web client for decentralized travel application. Based on STEEM and IPFS.
 
## Run for local development
```yarn run dev```

## SPA version
#### https://ipfs.io/ipns/dtrip.app/
```
docker-compose run --rm spa-build
```
After that you can use the static version of the application from the ```dist``` folder.
```
ipfs add -r dist | tail -n 1 | awk '{print $2;}' | ipfs pin add -r
```

## SSR version
### [dtrip.app](https://dtrip.app)
#### Run docker
Create .env file
```
docker-compose pull && docker-compose up -d web
```

or build by you self

```
docker-compose up web -d --build
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
