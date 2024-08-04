---
layout: tutorial
permalink: /tutorials/createGraph.html
title: Sprite Tutorials — Create a Graph
name: Create a Graph
prevDesc: Add a Document
prevUrl: /tutorials/createDocument.html
nextDesc: Selecting Records
nextUrl: /tutorials/select.html
filename: 6_createGraph.md
---

#### Introduction

Sprite utilizes the `GraphRepository` to create graphs, which consist of vertices (points) and edges connecting them (lines). Both vertices and edges can contain data properties, similar to documents.

---

###### Note:

Consider reading [Wikipedia: Graph Database](https://en.wikipedia.org/wiki/Graph_database), if this is a new concept to you.

---

#### Overview

This tutorial will guide you through creating types that define the vertices and edges of our graph, and then inserting records into the database to build the graph with the defined types.

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Accessing the GraphRepository](#accessing-the-graphrepository)
4. [Create a Transaction](#create-a-transaction)
5. [Creating Graph Types](#creating-graph-types)
6. [Create the Vertices](#creating-the-vertices)
7. [Create an Edge](#creating-an-edge)
8. [Running the Example](#running-the-example)
9. [Conclusion](#conclusion)
10. [What's Next](#what-is-next)

#### Prerequisites

1. Ensure you have completed [the installation](./installation.html) and have ArcadeDB installed, running, and accessible, as well as a TypeScript/JavaScript project with Sprite installed.
2. You have created a database called "ExampleDatabase" per the [Creating a Database tutorial](./createDatabase.html)

#### Setup

Begin by inserting the following snippet into the `index.ts` file of your project:

```ts
// Import the SpriteDatabase class from the sprite package
import { SpriteDatabase } from '@valence-corp/sprite';

// Create an instance of SpriteDatabase with your credentials and the name of the target database
const db = new SpriteDatabase({
  username: 'aUsername', // root will be okay for this tutorial
  password: 'aPassword', // your password
  address: 'http://localhost:2480', // default address for ArcadeDB
  databaseName: 'ExampleDatabase' // the existing database
});
```

#### Accessing the GraphRepository

The `GraphRepository` is accessed via the `SpriteDatabase` instance we created. Types are defined in the `ExampleVertexes` and `ExampleEdges` interfaces provided as parameters to the `graphRepository` accessor method.

Add the following code below the previous section:

```ts
// Define the vertex type
interface ExampleVertexes {
  Airport: {
    name: string;
  };
}

// Define the edge type
interface ExampleEdges {
  Flight: {
    dateTime: number;
  };
}

// Create an instance of the SpriteDatabase.graphRepository
// with the types we wish to access as parameters
const client = db.graphRepository<ExampleVertexes, ExampleEdges>();

// Create an async function to perform operations on the database
async function graphRepositoryExample() {
  try {
    // Code from the tutorial will be inserted here
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error
    });
  }
}

// Call the example function
graphRepositoryExample();
```

#### Create a Transaction

ArcadeDB is a transactional database, which is preferred for applications that require a high level of data integrity. All non-idempotent operations (operations that can change the database) must be part of a transaction.

Sprite has various methods for orchestrating transactions, but this tutorial will utilize the `GraphRepository.transaction()` method, which reduces boilerplate.

```ts
async function graphRepositoryExample() {
  try {
    // A transaction is created, its only argument is
    // a callback (which is passed the transaction)
    client.transaction(async (trx) => {
      // ...operations go here
      // The transaction is automatically committed
      // following callback execution
    });
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error
    });
  }
}
```

#### Creating Graph Types

The transaction callback serves as a scope for the transaction, such as the `GraphRepository.createVertex` and `GraphRepository.createEdge` methods. Prior to creating any records, we will establish the types in the schema using `GraphRepository.createVertexType` and `GraphRepository.createEdgeType`.

The `ifNotExists` option is set to true on the type creation operations. This prevents the database from throwing an error if the types were previously created. This, however, is optional.

```ts
async function graphRepositoryExample() {
  try {
    await client.createVertexType('Airport', {
      ifNotExists: true
    });
    await client.createEdgeType('Flight', {
      ifNotExists: true
    });
    client.transaction(async (trx) => {
      // The transaction should be passed to all
      // crud operations
    });
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error
    });
  }
}
```

#### Creating the Vertices

The `newVertex` method (and the other record creation methods) allow for the creation of multiple records in the same operation. This is preferable to sending a command for each record (although, that is also valid). Just send the data for the desired records as an array of objects representing the records.

The result will be returned as an array of the created records. This example destructures the expected results for use in the next step.

```ts
async function graphRepositoryExample() {
  try {
    await client.createVertexType('Airport', {
      ifNotExists: true
    });
    await client.createEdgeType('Flight', {
      ifNotExists: true
    });

    client.transaction(async (trx) => {
      // Create two vertices with the type
      // created in the previous line, note that
      // the transaction is the second argument
      const [vertex1, vertex2] = await client.newVertex('Airport', trx, {
        data: [
          {
            name: 'LAX'
          },
          {
            name: 'ABQ'
          }
        ]
      });
    });
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error
    });
  }
}
```

#### Creating an Edge

To create an edge, we will use the `GraphRepository.newEdge()` method. This example utilizes the `@rid` of the created records, but that is only for brevity. The `GraphRepository.newEdge()` method allows for defining edges between records that match "key descriptions", which can result in creating multiple edges between any records that match the provided key/index. See [the API documentation](../GraphRepository/newEdge.html) for details.

There is also a `console.log` call added to log the records that were created.

```ts
async function graphRepositoryExample() {
  try {
    await client.createVertexType('Airport', {
      ifNotExists: true
    });
    await client.createEdgeType('Flight', {
      ifNotExists: true
    });
    client.transaction(async (trx) => {
      const [vertex1, vertex2] = await client.newVertex('Airport', trx, {
        data: [
          {
            name: 'LAX'
          },
          {
            name: 'ABQ'
          }
        ]
      });

      // An edge is created by placing the @rid
      // of the vectors you wish to connect as
      // parameters, the transaction, and
      // (optionally) data contained within
      // the edge
      const edge = await client.newEdge(
        'Flight',
        vertex1['@rid'],
        vertex2['@rid'],
        trx,
        {
          data: {
            dateTime: new Date().toString()
          }
        }
      );

      // We are logging the results
      // to provide some confirmation
      console.log({
        vertex1,
        vertex2,
        edge
      });
    });
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error
    });
  }
}
```

#### Running the Example

Below is the complete code for this tutorial. Ensure your code matches this example, and then execute it.

```ts
import { SpriteDatabase } from "@valence-corp/sprite";

const db = new SpriteDatabase({
  username: "aUsername", // root will be okay for this tutorial
  password: "aPassword", // your password
  address: "http://localhost:2480", // default address for ArcadeDB
  databaseName: "ExampleDatabase", // the existing database
});

interface ExampleVertexes {
  Airport: {
    name: string;
  };
}

interface ExampleEdges {
  Flight: {
    dateTime: string;
  };
}

const client = db.graphRepository<ExampleVertexes, ExampleEdges>();

async function graphRepositoryExample() {
  try {
    await client.createVertexType("Airport", {
      ifNotExists: true,
    });
    await client.createEdgeType("Flight", {
      ifNotExists: true,
    });
    client.transaction(async (trx) => {
      const [vertex1, vertex2] = await client.newVertex("Airport", trx, {
        data: [
          {
            name: "LAX",
          },
          {
            name: "ABQ",
          },
        ],
      }
    }
  } catch (error) {
    new Erorr(
      'An error occured while runinng the example',
      { cause: error }
    );
  }
};
```

#### Conclusion

This tutorial demonstrated the basics of creating a graph database using Sprite and ArcadeDB, including: accessing the graph repository, defining the types of vertices and edges in the graph, and creating vertices and edges within a transaction.

#### What's Next?

The next section will demonstrate the various method of performing a select query to retrieve records.
