---

layout: default

title: explain

permalink: /SpriteDatabase/explain.html

---

### _SpriteDatabase_.explain

#### Interface

(**sql: *string***)

Returns information about query execution planning of a specific statement,
without executing the statement itself.

#### Example

```ts
const db = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aDatabase'
});

async function spriteExplainExample() {
  try {
    const explanation = await db.explain("SELECT FROM schema:types");
    console.log(explanation);
    // {
    //   executionPlan: {
    //     type: 'QueryExecutionPlan',
    //     javaType: 'com.arcadedb.query.sql.executor.SelectExecutionPlan',
    //     cost: -1,
    //     prettyPrint: '+ FETCH DATABASE METADATA TYPES',
    //     steps: [ [Object] ]
    //   },
    //   executionPlanAsString: '+ FETCH DATABASE METADATA TYPES'
    // }
    return explanation;
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

spriteExplainExample();
```

