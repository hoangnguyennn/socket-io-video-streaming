## Video call

## Requirements

- Install [node](https://github.com/nodejs/node)
- Install [yarn](https://github.com/yarnpkg/yarn) (for CLI - optional, can use `npm` instead)
- Install [lerna](https://github.com/lerna/lerna)

## Install all dependencies

```bash
yarn && lerna bootstrap
```

## How to use

### Development

```bash
# Start client, port 9000
yarn client-dev

# Start express server, port 3000
yarn server-dev
```

Open `http://localhost:9000/` to use.

### Production

Note: For simplicity, I use the default `peer server`: `0.peerjs.com`.

Build client:

```bash
yarn client-build
```

Then, move all files in `./packages/client/dist` folder to `./packages/server/public` folder (if `public` folder doesn't exist, please create it)

Next, build server:

```bash
yarn server-build
```

Finally, start server (by default, server was run on port `3000`):

```bash
yarn server-start
```

Open `http://localhost:3000/` to use.
