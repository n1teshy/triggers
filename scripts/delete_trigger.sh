read -p "enter the trigger ID or name: " triggerId
read -s -p "enter the password: " password

if if [ -z "$triggerId" ] || [ -z "$password" ]; then
  exit 1
fi

echo -e "\n"
curl "https://triggers.netlify.app/.netlify/functions/triggers/$triggerId"\
  -X DELETE\
  --data "{\"password\": \"$password\"}"\
  -Lk
