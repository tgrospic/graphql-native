import { FIELD } from './field'

// User fields
export const fields = {
  id:        { type: FIELD.PK_NUM_SEQ, description: 'user identifier' },
  firstName: { type: FIELD.STRING,     description: 'user first name' },
  lastName:  { type: FIELD.STRING,     description: 'user last name' },
  email:     { type: FIELD.STRING,     description: 'user email' },
  phone:     { type: FIELD.STRING,     description: 'user phone' },
  address:   { type: FIELD.STRING,     description: 'user address' },
  note:      { type: FIELD.STRING,     description: 'user note' },
  color:     { type: FIELD.STRING,     description: 'user color' }
}
