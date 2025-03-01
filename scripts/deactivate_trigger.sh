read -p "enter the trigger ID or name: " triggerId

if [ -z "$triggerId" ]; then
  exit 1
fi

curl "https://triggers.netlify.app/.netlify/functions/triggers/$triggerId"\
  -X PUT\
  -Lk
