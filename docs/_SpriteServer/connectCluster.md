---

layout: default

title: connectCluster

permalink: /SpriteServer/connectCluster.html

---

### _SpriteServer_.connectCluster

#### Interface

(**address: *string***)

Connects this server to a cluster with `address`.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function connectClusterExample(address: string) {
  try {
    const connected = await server.connectCluster(address);
    console.log(connected);
    // true
  } catch (error) {
    console.log(error);
    // handle error conditions
  }
}

connectClusterExample('192.168.0.1');
```

