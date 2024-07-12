---

layout: default

title: getInformation

permalink: /SpriteServer/getInformation.html

---

### _SpriteServer_.getInformation

#### Interface

(**mode: *M***)

Returns the current configuration.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function getInformationExample(mode: ArcadeServerInformationLevel) {
  try {
    const information = await sprite.getInformation(mode);
    console.log(information);
    // {
    //   user: 'aUser',
    //   version: '24.x.x',
    //   serverName: 'ArcadeDB_0'
    // }
  } catch (error) {
    console.error(error);
    // handle error condition
  }
}

getInformationExample('basic');
```

