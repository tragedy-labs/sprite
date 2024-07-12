---

layout: default

title: ISpriteDropTypeOptions

permalink: /types/ISpriteDropTypeOptions.html

---

### ISpriteDropTypeOptions

Options for a database.dropType() command

#### Definition

<h5> ifExists?: <span>boolean</span></h5>Prevent errors if the type does not exits when attempting to drop it.


---

<h5> unsafe?: <span>boolean</span></h5>Defines whether the command drops non-empty edge and vertex types. Note, this can
disrupt data consistency. Be sure to create a backup before running it.
@default: false


