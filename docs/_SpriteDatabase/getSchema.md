---

layout: default

title: getSchema

permalink: /SpriteDatabase/getSchema.html

---

### _SpriteDatabase_.getSchema

Return the current schema.

#### Example

```ts
async function getSchemaExample() {
  try {
    const schema = await db.getSchema();
    console.log(schema);
    // [...]
    return schema;
  } catch (error) {
    console.log(error);
    // handle error conditions
  }
}

getSchemaExample();
```

