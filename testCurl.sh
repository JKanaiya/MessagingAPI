 #!/bin/bash
 # user=$(
 #   curlie http://localhost:3000/sign-up -d '{
 #   "email": "bla12@fakemail.com",
 #   "password": "bla12passing",
 #   "name": "name12",
 #   "spectator": "true"
 #   }'
 #  )
 # echo $user

# tokenJson=$(
#   curlie http://localhost:3000/log-in -d '{
#    "email": "bla12@fakemail.com",
#    "password": "bla12passing"
#    }'
# )
# echo $tokenJson
#
# token=$(echo $tokenJson | jq -r ".token")
#
#  echo $token
#
# output=$(
#   curlie http://localhost:3000/users -H "Authorization: Bearer $token"
# )
#
# echo $output

tokenJson=$(
  curlie http://localhost:3000/log-in -d '{
   "email": "bla12@fakemail.com",
   "password": "bla12passing"
   }'
)
echo $tokenJson

token=$(echo $tokenJson | jq -r ".token")

 echo $token

output=$(
  curlie http://localhost:3000/chatrooms -H "Authorization: Bearer $token"
)

echo $output

