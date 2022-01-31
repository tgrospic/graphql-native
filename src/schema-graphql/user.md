# User query

Example of a query which is created with dynamic schema described in [README.md](./README.md).

```graphql
mutation Create {
  userCreate(
    value: {
      firstName: "John"
      lastName: "Doe"
      email: "john.doe@gmail.com"
      #note: "My note"
      #created: "2022-01-31T12:30:00Z"
  	}
  ) {
    firstName
    lastName
    email
    #note
    #created
  }
}

mutation Update {
  userUpdate (
    value: {
      firstName: "John"
      lastName: "Doe"
      email: "john@doe.com"
  	}
  ) {
    firstName
    lastName
    email
    #note
    #created
  }
}

mutation Delete {
  userDelete (
    where: { id: 42 }
  )
}
```
