read -p "enter the trigger ID or name: " triggerId
read -s -p "enter the password: " password
curl "https://triggers.netlify.app/.netlify/functions/triggers/$triggerId"\
  -X PUT\
  --data '{"password": "$password"}'\
  -Lk
