 #!/bin/bash
 # user=$(
 #   curlie http://localhost:3000/sign-up -d '{
 #   "email": "bla2@fakemail.com",
 #   "password": "",
 #   "name": "name1"
 #   }'
 #  )

tokenJson=$(
  curlie http://localhost:3000/log-in -d '{
   "email": "bla2@fakemail.com",
   "password":"bla@password",
   "name": "bla2"
   }'
)

token=$(echo $tokenJson | jq -r ".token")

# userId=$(echo $user | jq -r ".id")

check=$(curlie http://localhost:3000/auth-check -H "Authorization: Bearer $token" -X POST)
echo $check

chatrooms=$(curlie http://localhost:3000/chatrooms -H "Authorization: Bearer $token" -X GET)
 echo $chatrooms

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
