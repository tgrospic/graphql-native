# GraphQL

Više o [GraphQL schemi](./graphql.md).

## Primjer kreiranja scheme u _item_ tablici

`itype` je kao labela ili tag i određuje šta taj redak predstavlja. Za neki bazni tip kao što je _string_ ili _int_ to je zapravo tip upisan u taj redak, ali npr. `ENTITY` grupira field-ove i nema konkretnu vrijednost upisanu u sami redak.

Kad to imamo u bazi onda sa `Items` querijem (u rekurzivnoj verziji) dohvatimo schemu i kreiramo GraphQL type od root-a [schema-graphql/types.js](./types.js). Ono što nam još fali je način za upis relacija između dva `item` -a.

### Primjer kreiranja dinamičke scheme sa tipom _user_

Prvo se kreira root node `CreateRoot`, zatim user type sa nekoliko field-ova `CreateUserType`, onda mu se može dodat još koji field sa `AddNoteToUser` ili `AddCreatedToUser`.

Sa definiranom schemom vrijede tipizirani queriji za user-a [user.md](./user.md).

_Svaki query/mutacija se može okinut samo jedan po jedan. Na `CTRL+ENTER` gdje je kursor ili preko ▶ u headeru._

```graphql
mutation CreateRoot {
  itemCreate(value: {
    itype: "ROOT"
    info: "Root node"
  }) {
    info
    result {
      id
    }
  }
}

mutation CreateUserType {
  itemCreate(value: {
    itemId: 1
    itype: "ENTITY"
    valString: "user"
    info: "user collection"
    items: [{
      itype: "NUMBER"
      valString: "id"
      info: "primary key"
    }, {
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
    info
    result {
      id
      itype
      valString
      items {
        id
        itemId
        itype
        valString
      }
    }
  }
}

mutation AddNoteToUser {
  itemCreate(value: {
    itemId: 2 # user ENTITY
    itype: "STRING"
    valString: "note"
    info: "user note"
  }) {
    result {
      id
    }
  }
}

mutation AddCreatedToUser {
  itemCreate(value: {
    itemId: 2 # user ENTITY
    itype: "DATE"
    valString: "created"
    info: "user date created"
  }) {
    result {
      id
    }
  }
}

mutation UpdateUserType {
  itemUpdate(value: {
    itype: "ENTITY"
    info: "--- user type ---"
    #valString: "user"
  }, where: "itype='ENTITY' AND valString='user'") {
    info
    result {
      id
      itemId
      valString
      info
    }
  }
}

mutation DeleteItem {
  itemDelete(where: "id > 1") {
    result
    info
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
