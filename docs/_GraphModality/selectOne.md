---

layout: default

title: selectOne

permalink: /GraphModality/selectOne.html

---

### _GraphModality&lt;V, E&gt;_.selectOne

#### Interface

(**rid: *string***)

Select a specific record by providing the `rid`

#### Example

```ts
const database = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aSpriteDatabase'
});

type DocTypes = {
  aType: {
    aField: string
  }
}

const client = database.documentModality<DocTypes>();

async function selectOneExample() {
  try {
    const result = await client.selectOne<'aType'>('#0:0');
    console.log(result);
    // {
    //   '@rid': '#0:0',
    //   '@type': 'aType',
    //   '@cat': 'd',
    //   aField: 'aValue'
    // }
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

selectOneExample();
```

