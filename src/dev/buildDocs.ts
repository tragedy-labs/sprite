import fs from 'fs';
import path from 'path';

interface ITypeDocsDocumentFlags {
  isPrivate?: boolean;
  isProtected?: boolean;
  isOptional?: boolean;
}

interface ITypeDocsBlockTag {
  tag: '@example' | '@param' | '@returns' | '@throws' | '@default';
  content: Array<string>;
}

interface ITypeDocsDocumentComment {
  summary: Array<{ text: string }>;
  blockTags: Array<ITypeDocsBlockTag>;
}

type TypeDocsTypescriptTypes =
  | 'literal'
  | 'intrinsic'
  | 'union'
  | 'reference'
  | 'array';

interface ITypeDocTypeDefinition {
  type: TypeDocsTypescriptTypes;
  value: string;
}

interface ITypeDocTypesDefinition {
  name: string;
  type: TypeDocsTypescriptTypes;
  types?: Array<ITypeDocTypeDefinition>;
}

interface ITypeDocsParameter {
  name: string;
  defaultValue: string;
  comment: {
    summary: [
      {
        text: string;
      }
    ];
  };
  type: ITypeDocTypesDefinition;
}

type TypeDocsGroup = {
  title: 'Constructors' | 'Properties' | 'Methods';
  children: Array<number>;
};

type TypeDocsNodeGroups = Array<TypeDocsGroup>;

interface ITypeDocsTypeParameterDefinition {
  id: number;
  name: string;
  variant: 'typeParam';
  kind: number;
  flags: ITypeDocsDocumentFlags;
  type?: {
    type: 'reference';
    name: string;
    target: number;
    typeArguments: [
      {
        type: 'reference';
        target: number;
        name: string;
        package: string;
        refersToTypeParameter: boolean;
      }
    ];
  };
}
type TypeDocsTypeParameters = Array<ITypeDocsTypeParameterDefinition>;

interface ITypeDocsNode {
  id: number;
  name: string;
  variant: 'declaration' | 'signature' | 'param' | 'typeParam' | 'project';
  kind: number;
  flags: ITypeDocsDocumentFlags;
  comment: ITypeDocsDocumentComment;
  typeParameters?: TypeDocsTypeParameters;
  type?: {
    type: TypeDocsTypescriptTypes;
    name: string;
    types?: Array<ITypeDocTypeDefinition>;
    elementType?: {
      type: 'indexedAccess';
      indexType: {
        type: 'reference';
        target: number;
        name: string;
        package: string;
        refersToTypeParameter: boolean;
      };
      objectType: {
        type: 'reference';
        target: number;
        name: string;
        package: string;
        refersToTypeParameter: boolean;
      };
    };
  };
  children: Array<ITypeDocsNode>;
  groups: TypeDocsNodeGroups;
  signatures: [
    {
      comment: {
        summary: [{ kind: string; text: string }];
      };
    }
  ];
}

class Juniper {
  typedocs: ITypeDocsNode;
  nav: any = {
    modules: [],
    types: []
  };
  constructor(docsJson: ITypeDocsNode) {
    this.typedocs = docsJson;
    this.parseNodes();
    this.writeJekyllNavigation();
  }
  parseNodes = () => {
    this.typedocs.children.forEach((node: ITypeDocsNode) => {
      if (node.variant === 'declaration' && node.kind === 128) {
        const document = new JuniperClassNode(node);
        this.nav.modules.push({ name: document.name, methods: document.data });
      }
      if (
        node.variant === 'declaration' &&
        (node.kind === 256 || node.kind === 2097152 || node.kind === 32768)
      ) {
        const document = new JuniperTypeNode(node);
        this.nav.types.push(document.link);
      }
    });
  };
  writeJekyllNavigation = () => {
    fs.writeFileSync(
      path.join(__dirname, '../../docs/_data/nav.json'),
      JSON.stringify(this.nav),
      'utf-8'
    );
  };
}

class JekyllMarkDownDocument {
  string: string = '';
  add = {
    hr: () => this.append('---'),
    heading: {
      h1: (text: string) => {
        this.append(`# ${text}`);
      },
      h2: (text: string) => {
        this.append(`## ${text}`);
      },
      h3: (text: string) => {
        this.append(`### ${text}`);
      },
      h4: (text: string) => {
        this.append(`#### ${text}`);
      },
      h6: (text: string) => {
        this.append(`##### ${text}`);
      },
      h3WithAnchor: (text: string) => {
        this.append(`#### <a name="${text}">${text}</a>`);
      }
    },
    text: {
      p: (markdown: string) => {
        this.append(markdown);
      },
      note: (markdown: string) => {
        this.append('---');
        this.append(`${markdown}`);
        this.append('---');
      }
    },
    list: {
      item: (markdown: string) => {
        this.append(`- ${markdown}`);
      }
    },
    code: {
      block: (text: string) => {
        this.append(text);
      }
    },
    table: {
      withHeader: (columns: Array<string>, rows: string[][]) => {
        this.newLine(`|${columns.join('|')}|`);
        this.newLine(
          `|${new Array(columns.length).fill(':--------').join('|')}|`
        );
        rows.forEach((row) => {
          this.newLine(`|${row.join('|')}|`);
        });
        this.append('');
      }
    }
  };
  constructor(layout: string, title: string, relativePath: string) {
    this.addLayoutTags(layout, title, relativePath);
  }
  private addLayoutTags = (
    layout: string,
    title: string,
    relativePath: string
  ) => {
    this.append(`---`);
    this.append(`layout: ${layout}`);
    this.append(`title: ${title}`);
    this.append(`permalink: ${relativePath}/${title}.html`);
    this.append(`---`);
  };
  append = (string: string) => {
    this.string += `${string}\n\n`;
  };
  newLine = (string: string) => {
    this.string += `${string}\n`;
  };
}

class JuniperMarkDownNode {
  name: string;
  node: ITypeDocsNode;
  constructor(node: ITypeDocsNode) {
    this.name = node.name;
    this.node = node;
  }
}

interface IJuniperNodePath {
  dir: string;
  relative: string;
  full: string;
}

class JuniperMarkDownMethodNode extends JuniperMarkDownNode {
  markdown: JekyllMarkDownDocument;
  path: IJuniperNodePath;
  parentNode: ITypeDocsNode;
  parentTypes: string | undefined;
  parentString: string;
  constructor(
    node: ITypeDocsNode,
    parentNode: ITypeDocsNode,
    parentTypes: string | undefined
  ) {
    super(node);
    this.parentNode = parentNode;
    this.parentTypes = parentTypes;
    this.path = this.buildPath();

    this.markdown = new JekyllMarkDownDocument(
      'default',
      this.name,
      this.path.relative
    );

    this.parentString = parentTypes
      ? `_${this.parentNode.name}&lt;${parentTypes}&gt;_`
      : `_${this.parentNode.name}_`;

    this.markdown.add.heading.h3( node.name === 'constructor' ? this.parentString : `${this.parentString}.${node.name}`);

    if (this.node.name === 'constructor') {
      if (this.node.signatures) {
        this.node.signatures.forEach((signature: any) => {
          if (signature.parameters) {
            this.processParameters(signature.parameters);
          }
        });
      }

      if (this.parentNode?.comment) {
        this.processSummary(this.parentNode.comment.summary);
      }
      if (this.parentNode?.comment?.blockTags) {
        this.processBlockTags(this.parentNode.comment.blockTags);
      }
    } else {
      if (this.node.signatures) {
        this.node.signatures.forEach((signature: any) => {
          if (signature.parameters) {
            this.processParameters(signature.parameters);
          }
          if (signature.comment) {
            this.processSummary(signature.comment.summary);
          }
          if (signature.comment?.blockTags) {
            this.processBlockTags(signature.comment.blockTags);
          }
        });
      }
    }
  }
  buildPath = (): IJuniperNodePath => {
    const dir = path.join(__dirname, '../../docs', `_${this.parentNode.name}`);
    const relative = path.join('/', this.parentNode.name);
    return {
      dir,
      relative,
      full: path.join(dir, `${this.name}.md`)
    };
  };
  processSummary = (summary: any[]) => {
    this.markdown.add.text.p(
      summary.map((segment: any) => segment.text).join('')
    );
  };
  processBlockTags = (blockTags: any[]) => {
    blockTags.forEach((tag: any) => {
      if (tag.tag === '@example') {
        this.markdown.add.heading.h4('Example');
        this.markdown.add.code.block(
          tag.content.map((content: any) => content.text).join('')
        );
      }
      if (tag.tag === '@note') {
        this.markdown.add.heading.h6('Note');
        this.markdown.add.text.note(
          tag.content.map((content: any) => content.text).join('')
        );
      }
    });
  };
  processParameters = (parameters: ITypeDocsParameter[]) => {
    const params = parameters
      .map((parameter: ITypeDocsParameter) => {
        let dataType: string = '';

        switch (parameter.type?.type) {
          case 'union':
            if (parameter.type.types) {
              dataType = parameter.type.types
                .map((type: ITypeDocTypeDefinition) => {
                  return type.value;
                })
                .join('.');
            }
            break;
          case 'intrinsic':
            dataType = parameter.type.name;
            break;
          case 'reference':
            //@ts-ignore
            const args = parameter.type.typeArguments
              ?.map((arg: any) => {
                return arg.name;
              })
              .join(', ');
            console.log(args);
            dataType = args
              ? `${parameter.type.name}&lt;${args}&gt;`
              : parameter.type.name;
            break;
          case 'literal':
            dataType = parameter.type.name;
            break;
          default:
            break;
        }

        return `${parameter.name}: *${dataType}*`;
      })
      .join(', ');

    this.markdown.add.heading.h4('Interface');
    this.markdown.add.text.p(`(**${params}**)`);

    //this.markdown.add.heading.h4('Parameters');
    // const rows = parameters.map((parameter: ITypeDocsParameter) => {
    //   return [
    //     parameter.name,
    //     Array.isArray(parameter.type.types)
    //       ? parameter.type.types
    //           .map((thing: ITypeDocTypeDefinition) => thing.value)
    //           .join(', ')
    //       : parameter.type.name,
    //     parameter.defaultValue || 'undefined',
    //     parameter.comment?.summary
    //       .map((segment) => {
    //         return segment.text;
    //       })
    //       .join(''),
    //   ];
    // });

    // this.markdown.add.table.withHeader(
    //   ['name', 'type', 'default', 'description'],
    //   rows,
    // );
  };
}

class JuniperMarkDownTypeNode extends JuniperMarkDownNode {
  markdown: JekyllMarkDownDocument;
  path: {
    relative: string;
    dir: string;
    full: string;
  };
  constructor(node: ITypeDocsNode) {
    super(node);
    this.path = this.buildPath();
    this.markdown = new JekyllMarkDownDocument(
      'default',
      this.name,
      this.path.relative
    );

    this.process();
  }
  buildPath = (): IJuniperNodePath => {
    const dir = path.join(__dirname, '../../docs/_types/');
    return {
      dir,
      relative: `/types`,
      full: path.join(dir, `${this.name}.md`)
    };
  };
  extractTypeParameters = (parameters: TypeDocsTypeParameters) => {
    return parameters
      .map((param) => {
        if (param.type?.typeArguments) {
          const argString = param.type.typeArguments
            .map((arg) => {
              return arg.name;
            })
            .join(', ');
          return `${param.name} extends ${param.type.name}&lt;${argString}&gt;`;
        } else {
          return param.name;
        }
      })
      .join(', ');
  };
  typeNameWithParameters = (name: string, parameters: string) => {
    return `${name}<br/>` + `<${parameters}>`;
  };
  getOptional = (isOptional?: boolean) => {
    return isOptional ? '?' : '';
  };
  process = () => {
    const { type, typeParameters, name, signatures } = this.node;

    this.markdown.add.heading.h3(
      typeParameters
        ? this.typeNameWithParameters(
            name,
            this.extractTypeParameters(typeParameters)
          )
        : name
    );

    if (this.node?.comment?.summary) {
      this.markdown.add.text.p(
        this.node.comment.summary.map((segment: any) => segment.text).join('')
      );
    }
    if (this.node.type) {
      this.markdown.add.heading.h4('Definition');
      this.markdown.add.hr();

      if (this.node.type.type === 'union' && this.node.type.types) {
        this.markdown.add.text.p(
          this.node.type.types
            .map((type) => {
              return `\`${type.value}\``;
            })
            .join(' &#124; ')
        );
      }

      if (
        this.node.type.type === 'array' &&
        this.node.type.elementType?.type == 'indexedAccess'
      ) {
        this.markdown.add.text.p(
          `\`Array<${this.node.type.elementType.objectType.name}[${this.node.type.elementType.indexType.name}]>\``
        );
      }
    }
    if (this.node?.comment?.blockTags) {
      this.node.comment.blockTags.forEach((tag) => {
        let tagTitle = '';
        switch (tag.tag) {
          case '@default':
            tagTitle += 'Default';
            break;
          default:
            break;
        }
        this.markdown.add.heading.h4(tagTitle);
        this.markdown.add.text.p(
          tag.content
            .map((tag: any) => {
              if (tag.text.includes('```ts')) {
                return `\`${tag.text
                  .substring(5, tag.text.length - 3)
                  .trim()}\``;
              } else {
                return tag.text;
              }
            })
            .join('')
        );
      });
    }
    if (this.node.children?.length) {
      this.markdown.add.heading.h4('Definition');
      this.node.children.forEach((definition, n) => {
        if (definition.comment) {
          const summary = definition.comment?.summary
            .map((segment) => segment.text)
            .join('');

          let dataType: string = '';

          switch (definition.type?.type) {
            case 'union':
              if (definition.type.types) {
                dataType = definition.type.types
                  .map((type: ITypeDocTypeDefinition) => {
                    return type.value;
                  })
                  .join(' | ');
              }
              break;
            case 'intrinsic':
              dataType = definition.type.name;
              break;
            case 'literal':
              dataType = definition.type.name;
              break;
            default:
              break;
          }

          let template = `<h5> ${definition.name}${this.getOptional(
            definition.flags.isOptional
          )}: <span>${dataType}</span></h5>`;
          template += `${summary}\n`;

          this.markdown.add.text.p(template);

          if (n < this.node.children.length - 1) {
            this.markdown.add.hr();
          }
        }
      });
    }
  };
}

class JuniperClassNode {
  name: string;
  data: any = [];
  node: ITypeDocsNode;
  typeParams: string | undefined;
  constructor(node: ITypeDocsNode) {
    this.name = node.name;
    this.node = node;
    this.processNodes();
  }
  processNodes = () => {
    this.node.children.forEach((child) => {
      // constructors
      if (child.kind === 512) {
        this.parseMethodNode(child, this.node, this.typeParams);
      }
      // // properties
      // if (node.kind === 1024) {
      //   console.log(node.name)
      // }

      // methods
      if (
        child.kind === 2048 &&
        !child.flags.isPrivate &&
        !child.flags.isProtected
      ) {
        this.parseMethodNode(child, this.node, this.typeParams);
      }
    });
  };
  parseConstructor = (docs: ITypeDocsNode, parentNode: ITypeDocsNode) => {
    // console.log(docs);
    // @ts-ignore
    this.typeParams = docs.signatures[0].typeParameter
      // @ts-ignore
      ?.map((p) => {
        console.log(p);
        return p.name;
      })
      .join(', ');
  };
  parseMethodNode = (
    docs: ITypeDocsNode,
    parentNode: ITypeDocsNode,
    parentTypes?: string
  ) => {
    const node = new JuniperMarkDownMethodNode(docs, parentNode, parentTypes);

    if (docs.name === 'constructor') {
      this.data = [
        {
          name: docs.name,
          link: `${node.path.relative}/${node.name}.html`
        },
        this.data
      ];
    } else {
      this.data.push({
        name: docs.name,
        link: `${node.path.relative}/${node.name}.html`
      });
    }

    // check if the directory exists before writing the file,
    // create the directory if it doesn't exist
    if (!fs.existsSync(node.path.dir)) {
      fs.mkdirSync(node.path.dir);
    }
    fs.writeFileSync(node.path.full, node.markdown.string, 'utf-8');
  };
}

class JuniperTypeNode {
  name: string;
  link: any = {};
  node: ITypeDocsNode;
  constructor(node: ITypeDocsNode) {
    this.name = node.name;
    this.node = node;
    this.processNode();
  }
  processNode = () => {
    const node = new JuniperMarkDownTypeNode(this.node);
    this.link.name = node.name;
    this.link.link = `${node.path.relative}/${node.name}.html`;
    fs.writeFileSync(node.path.full, node.markdown.string, 'utf-8');
  };
}

const rawData = fs.readFileSync(
  path.join(__dirname, '../../docs/_data/docs.json'),
  'utf-8'
);

const jsonTypeDocs = JSON.parse(rawData);

new Juniper(jsonTypeDocs);
