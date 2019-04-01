# GraphQL schema

## `resolver : query_AST -> response_JSON`

- GraphQL parsira query i pretvara u _query_AST_ (_field_ argument u resolver funkciji)

Primjer query

```graphql
query {
  items {
    id
    itemId
    valString
    items {
      id
      itemId
      info
    }
  }
}
```

Ovo je query prebačen u JSON preko [selectionToInclude](./resolver.js#resolver.js-11) funkcije koja koristi query AST iz [resolveQuery](./resolver.js#resolver.js-64) field argumenta.

```json
{
  "name": "items",
  "as": "items",
  "attributes": [
    "id",
    "itemId",
    "valString"
  ],
  "include": [
    {
      "name": "items",
      "as": "items",
      "attributes": [
        "id",
        "itemId",
        "info"
      ],
      "include": []
    }
  ]
}
```
