read -p "Name the trigger (optional): " name

if [ -z "$name" ]; then
  data='{}'
else
  data="{\"name\": \"$name\"}"
fi

curl https://triggers.netlify.app/.netlify/functions/triggers \
  -X POST \
  --data "$data" \
  -Lk