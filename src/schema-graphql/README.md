# GraphQL

Više o [GraphQL schemi](./graphql.md).

## Primjer kreiranja scheme u _item_ tablici

`itype` je kao labela ili tag i određuje šta taj redak predstavlja. Za neki bazni tip kao što je _string_ ili _int_ to je zapravo tip upisan u taj redak, ali npr. `ENTITY` grupira field-ove i nema konkretnu vrijednost upisanu u sami redak.

Kad to imamo u bazi onda sa `Items` querijem (u rekurzivnoj verziji) dohvatimo schemu i kreiramo GraphQL type od root-a [schema-graphql/types.js](./types.js). Ono što nam još fali je način za upis relacija između dva `item` -a.

### Primjer kreiranja dinamičke scheme sa tipom _user_

Prvo se kreira root node `CreateRoot`, zatim user type sa nekoliko field-ova `CreateUserType`, onda mu se može dodat još koji field sa `AddNoteToUser` ili `AddCreatedToUser`.

Sa definiranom schemom vrijede tipizirani queriji za user-a [user.md](./user.md).

[http://localhost:9876/graphql?query=CreateRoot(...)](http://localhost:9876/graphql?query=mutation%20CreateRoot%20%7B%0A%20%20itemCreate(value%3A%20%7B%0A%20%20%20%20itype%3A%20%22ROOT%22%0A%20%20%20%20info%3A%20%22Root%20node%22%0A%20%20%7D)%20%7B%0A%20%20%20%20info%0A%20%20%20%20result%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0Amutation%20CreateUserType%20%7B%0A%20%20itemCreate(value%3A%20%7B%0A%20%20%20%20itemId%3A%201%0A%20%20%20%20itype%3A%20%22ENTITY%22%0A%20%20%20%20valString%3A%20%22user%22%0A%20%20%20%20info%3A%20%22user%20collection%22%0A%20%20%20%20items%3A%20%5B%7B%0A%20%20%20%20%20%20itype%3A%20%22NUMBER%22%0A%20%20%20%20%20%20valString%3A%20%22id%22%0A%20%20%20%20%20%20info%3A%20%22primary%20key%22%0A%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20itype%3A%20%22STRING%22%0A%20%20%20%20%20%20valString%3A%20%22firstName%22%0A%20%20%20%20%20%20info%3A%20%22user%20first%20name%22%0A%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20itype%3A%20%22STRING%22%0A%20%20%20%20%20%20valString%3A%20%22lastName%22%0A%20%20%20%20%20%20info%3A%20%22user%20last%20name%22%0A%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20itype%3A%20%22STRING%22%0A%20%20%20%20%20%20valString%3A%20%22email%22%0A%20%20%20%20%20%20info%3A%20%22user%20email%22%0A%20%20%20%20%7D%5D%0A%20%20%20%20%23...%20itd.%20phone%2C%20address%2C%20note%2C%20color%0A%20%20%7D)%20%7B%0A%20%20%20%20info%0A%20%20%20%20result%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20itype%0A%20%20%20%20%20%20valString%0A%20%20%20%20%20%20items%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20itemId%0A%20%20%20%20%20%20%20%20itype%0A%20%20%20%20%20%20%20%20valString%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0Amutation%20AddNoteToUser%20%7B%0A%20%20itemCreate(value%3A%20%7B%0A%20%20%20%20itemId%3A%202%20%23%20user%20ENTITY%0A%20%20%20%20itype%3A%20%22STRING%22%0A%20%20%20%20valString%3A%20%22note%22%0A%20%20%20%20info%3A%20%22user%20note%22%0A%20%20%7D)%20%7B%0A%20%20%20%20result%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0Amutation%20AddCreatedToUser%20%7B%0A%20%20itemCreate(value%3A%20%7B%0A%20%20%20%20itemId%3A%202%20%23%20user%20ENTITY%0A%20%20%20%20itype%3A%20%22DATE%22%0A%20%20%20%20valString%3A%20%22created%22%0A%20%20%20%20info%3A%20%22user%20date%20created%22%0A%20%20%7D)%20%7B%0A%20%20%20%20result%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0Amutation%20UpdateUserType%20%7B%0A%20%20itemUpdate(value%3A%20%7B%0A%20%20%20%20itype%3A%20%22ENTITY%22%0A%20%20%20%20info%3A%20%22---%20user%20type%20---%22%0A%20%20%20%20%23valString%3A%20%22user%22%0A%20%20%7D%2C%20where%3A%20%22itype%3D%27ENTITY%27%20AND%20valString%3D%27user%27%22)%20%7B%0A%20%20%20%20info%0A%20%20%20%20result%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20itemId%0A%20%20%20%20%20%20valString%0A%20%20%20%20%20%20info%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0Amutation%20DeleteItem%20%7B%0A%20%20itemDelete(where%3A%20%22id%20%3E%201%22)%20%7B%0A%20%20%20%20result%0A%20%20%20%20info%0A%20%20%7D%0A%7D%0A%0Aquery%20Items%20%7B%0A%20%20items%20%7B%0A%20%20%20%20id%0A%20%20%20%20itemId%0A%20%20%20%20itype%0A%20%20%20%20valString%0A%20%20%20%20info%0A%20%20%20%20items%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20itype%0A%20%20%20%20%20%20valString%0A%20%20%20%20%20%20info%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&operationName=DeleteItem)

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
