---

layout: default

title: disconnectCluster

permalink: /SpriteServer/disconnectCluster.html

---

### _SpriteServer_.disconnectCluster

Disconnects the server from the cluster.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function disconnectClusterExample() {
  try {
    const disconnected = await server.disconnectCluster();
    console.log(disconnected);
    // true
  } catch (error) {
    console.error(error);
    // handle error condition
  }
}

disconnectClusterExample();
```

