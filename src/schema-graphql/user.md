# User query

Primjer querija za user-a koji je kreiran sa dinamičkom schemom opisanom u [README.md](./README.md).

[http://localhost:9876/graphql?query=Create(...)](http://localhost:9876/graphql?query=mutation%20Create%20%7B%0A%20%20userCreate(%0A%20%20%20%20value%3A%20%7B%0A%20%20%20%20%20%20firstName%3A%20%22pero%22%0A%20%20%20%20%20%20lastName%3A%20%22peri%C4%87%22%0A%20%20%20%20%20%20email%3A%20%22pero%40peric.com%22%0A%20%20%09%7D%0A%20%20)%20%7B%0A%20%20%20%20firstName%0A%20%20%20%20lastName%0A%20%20%20%20email%0A%20%20%20%20created%0A%20%20%20%20%23note%0A%20%20%7D%0A%7D%0A%0Amutation%20Update%20%7B%0A%20%20userUpdate%20(%0A%20%20%20%20value%3A%20%7B%0A%20%20%20%20%20%20firstName%3A%20%22pero%22%0A%20%20%20%20%20%20lastName%3A%20%22peri%C4%87%22%0A%20%20%20%20%20%20email%3A%20%22pero%40peric.com%22%0A%20%20%09%7D%0A%20%20)%20%7B%0A%20%20%20%20firstName%0A%20%20%20%20lastName%0A%20%20%20%20email%0A%20%20%20%20%23note%0A%20%20%7D%0A%7D%0A%0Amutation%20Delete%20%7B%0A%20%20userDelete%20(%0A%20%20%20%20where%3A%20%7B%20id%3A%2043%20%7D%0A%20%20)%0A%7D&operationName=Create)

```graphql
mutation Create {
  userCreate(
    value: {
      firstName: "pero"
      lastName: "perić"
      email: "pero@peric.com"
  	}
  ) {
    firstName
    lastName
    email
    created
    #note
  }
}

mutation Update {
  userUpdate (
    value: {
      firstName: "pero"
      lastName: "perić"
      email: "pero@peric.com"
  	}
  ) {
    firstName
    lastName
    email
    #note
  }
}

mutation Delete {
  userDelete (
    where: { id: 43 }
  )
}
```
