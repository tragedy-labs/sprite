---
layout: tutorial
permalink: /tutorials/introduction.html
title: Sprite Tutorials - Introduction
name: Introduction
nextDesc: Installation
nextUrl: /tutorials/installation.html
filename: 1_introduction.md
---

Sprite is a TypeScript (or JavaScript) driver/client for ArcadeDB designed to work with data in [document](https://en.wikipedia.org/wiki/Document-oriented_database) and [graph](https://en.wikipedia.org/wiki/Graph_database) formats. Future releases will include support for [timeseries](https://github.com/ArcadeData/arcadedb/discussions/1180) functionality.

It provides a typesafe interface for interacting with the [ArcadeDB REST API](https://docs.arcadedb.com/#HTTP-API-NODEJS), using [JavaScript's native fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

The functionality is divided accross multiple modules to keep the namespace clean and focused.

#### Overview

1. [SpriteServer](#spriteserver)
2. [SpriteDatabase](#spritedatabase)
3. [Modalities](#modalities)
4. [What's Next?](#whats-next)

#### SpriteServer

The SpriteServer module provides methods for executing server-level commands, including:

- Creating and dropping databases
- User administration
- Settings / Configuration

#### SpriteDatabase

The SpriteDatabase module offers methods for performing core database operations, such as:

- Orchestrating transactions
- Issuing database commands
- Executing queries

This is a database driver for issuing SQL (or commands in another language).

#### Modalities

Higher-level abstractions are provided through two modalities: `DocumentModality` and `GraphModality`. These modules contain methods for performing CRUD operations and queries on specific record types. They build queries for the user, based on options. Modalities are currently exclusively accessed through a `SpriteDatabase` instance.

The modalities' design reduces overhead by instantiating functionality as required, keeping namespaces focused and organized.

#### What's next?

The next step in this tutorial briefly explains the installation process.
