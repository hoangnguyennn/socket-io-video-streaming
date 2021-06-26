## Video call

## Install all dependencies

```bash
$ yarn && lerna bootstrap
```

## How to use

### Development

```bash
# Start client, port 9000
$ yarn client-dev

# Start express server, port 3000
$ yarn server-dev
```

### Production

Note: For simplicity, I use the default `peer server`.

Build client:

```bash
$ yarn client-build
```

Then, move all files in `./packages/client/dist` folder to `./packages/server/public` folder (if `public` folder doesn't exist, please create it)

Next, build server:

```bash
$ yarn server-build
```

Finally, start server (by default, server was run on port `3000`):

```bash
$ yarn server-start
```
