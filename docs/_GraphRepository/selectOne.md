---

layout: default

title: selectOne

permalink: /GraphRepository/selectOne.html

---

### _GraphRepository&lt;V, E&gt;_.selectOne

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

const client = database.documentRepository<DocTypes>();

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

