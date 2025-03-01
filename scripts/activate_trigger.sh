read -p "enter the trigger ID or name: " triggerId
curl "https://triggers.netlify.app/.netlify/functions/triggers/$triggerId"\
  -X POST\
  -Lk
