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

Ovo je query prebačen u JSON preko [selectionToInclude](./resolver.js#L11) funkcije koja koristi query AST iz [resolveQuery](./resolver.js#L64) field argumenta.

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

## Primjer kreiranja scheme u _item_ tablici

Ovdje su 3 querija/mutacije ali može se okinut samo jedan po jedan. Na `CTRL+ENTER` gdje je kursor ili preko ▶ u headeru.

[http://localhost:9876/graphql?query=items(...)](http://localhost:9876/graphql?query=mutation%20CreateRoot%20%7B%0A%20%20createItem(value%3A%20%7B%0A%20%20%20%20itype%3A%20%22ROOT%22%0A%20%20%20%20info%3A%20%22Root%20node%22%0A%20%20%7D)%20%7B%0A%20%20%20%20id%0A%20%20%7D%0A%7D%0A%0Amutation%20CreateChilds%20%7B%0A%20%20createItem(value%3A%20%7B%0A%20%20%20%20itemId%3A%201%0A%20%20%20%20itype%3A%20%22ENTITY%22%0A%20%20%20%20valString%3A%20%22user%22%0A%20%20%20%20info%3A%20%22user%20collection%22%0A%20%20%20%20items%3A%20%5B%7B%0A%20%20%20%20%20%20itype%3A%20%22STRING%22%0A%20%20%20%20%20%20valString%3A%20%22firstName%22%0A%20%20%20%20%20%20info%3A%20%22user%20first%20name%22%0A%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20itype%3A%20%22STRING%22%0A%20%20%20%20%20%20valString%3A%20%22lastName%22%0A%20%20%20%20%20%20info%3A%20%22user%20last%20name%22%0A%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20itype%3A%20%22STRING%22%0A%20%20%20%20%20%20valString%3A%20%22email%22%0A%20%20%20%20%20%20info%3A%20%22user%20email%22%0A%20%20%20%20%7D%5D%0A%20%20%20%20%23...%20itd.%20phone%2C%20address%2C%20note%2C%20color%0A%20%20%7D)%20%7B%0A%20%20%20%20id%0A%20%20%7D%0A%7D%0A%0Aquery%20Items%20%7B%0A%20%20items%20%7B%0A%20%20%20%20id%0A%20%20%20%20itemId%0A%20%20%20%20itype%0A%20%20%20%20valString%0A%20%20%20%20info%0A%20%20%20%20items%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20itype%0A%20%20%20%20%20%20valString%0A%20%20%20%20%20%20info%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&operationName=Items)

`itype` je kao labela ili tag i određuje šta taj redak predstavlja. Za neki bazni tip kao što je _string_ ili _int_ to je zapravo tip upisan u taj redak, ali npr. `ENTITY` grupira field-ove i nema konkretnu vrijednost upisanu u sami redak.

Cilj nam je schemu definiranu u kôdu prepisat u `item` tablicu u bazu. `CreateChilds` kreira field-ove sa istim informacijama koje ima [user](./src/schema/user.js) specifikacija.

Kad to imamo u bazi onda sa `Items` querijem (u rekurzivnoj verziji) dohvatimo schemu i kreiramo GraphQL type od root-a [schema-graphql/query.js](./src/schema-graphql/query.js). Ono što nam još fali je način za upis relacija između dva `item` -a.

```graphql
mutation CreateRoot {
  createItem(value: {
    itype: "ROOT"
    info: "Root node"
  }) {
    id
  }
}

mutation CreateChilds {
  createItem(value: {
    itemId: 1
    itype: "ENTITY"
    valString: "user"
    info: "user collection"
    items: [{
      itype: "STRING"
      valString: "firstName"
      info: "user first name"
    }, {
      itype: "STRING"
      valString: "lastName"
      info: "user last name"
    }, {
      itype: "STRING"
      valString: "email"
      info: "user email"
    }]
    #... itd. phone, address, note, color
  }) {
    id
  }
}

query Items {
  items {
    id
    itemId
    itype
    valString
    info
    items {
      id
      itype
      valString
      info
    }
  }
}
```
