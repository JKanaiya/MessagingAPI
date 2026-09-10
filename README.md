to setup prisma to function, run 

```bash
 npx prisma init --db --output ../generated/prisma

```

### Chatrooms 
if chatrooms are created by a user, the functionality to add/invite a user(s?) to that chatroom would be worth it.
so it would be:
    1. User creates a chatroom
    2. User invites another user to the chatroom using their base username
        4. The chatroom id would be required to invite another user, meaning UserA can share the inv with UserB to allow UserB to inv someone else
    3. repeat above?

#### Messages
updating the messages would require getting the current time and finding the difference with the init time to see if its greater than the max. 
if not, allow update
