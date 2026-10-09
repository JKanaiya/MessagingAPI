 #!/bin/bash
 # user=$(
 #   curlie http://localhost:3000/sign-up -d '{
 #   "email": "bla10@fakemail.com",
 #   "password": "bla10passing",
 #   "name": "name10",
 #   "spectator": "true"
 #   }'
 #  )
 # echo $user

tokenJson=$(
  curlie http://localhost:3000/log-in -d '{
   "email": "bla10@fakemail.com",
   "password": "bla10passing",
   "name": "name10"
   }'
)
#
token=$(echo $tokenJson | jq -r ".token")

# # userId=$(echo $user | jq -r ".id")
#
# check=$(curlie http://localhost:3000/auth-check -H "Authorization: Bearer $token" -X GET)
# echo $check
#
chatrooms=$(curlie http://localhost:3000/chatrooms -H "Authorization: Bearer $token" -X GET)

users=$(echo $chatrooms | jq -r ".users" | rg spec4_93 )
 chatuser=$(echo $chatrooms | rg spec4_23)
 # echo $chatrooms 
 echo $users
# users=$(echo $chatrooms | jq -r ".users")
#  echo $users

# chatroom=$(curlie http://localhost:3000/chatroom -H "Authorization: Bearer $token" -X POST -d '{"user2Email": "bla1@fakemail.com"}')
#  echo $chatrooms

# chatroom=$(curlie http://localhost:3000/chatroom -H "Authorization: Bearer $token" -X POST)
#
# echo $chatroom
#
# chatId=$(echo $chatroom | jq -r ".messId")
#
# echo $chatId
#
# printf -v json -- '{ "name":"user1", "text": "hello again", "chatroomId": "%s" }' \
# "12"
#
# echo $json
#
# curlie -X POST "http://localhost:3000/message" \
#  -H "Authorization: Bearer $token" -H 'Content-Type: application/json' \
#  -d "$json"
