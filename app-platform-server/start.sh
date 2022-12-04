npm run build
pm2 restart npm --name app-platform -- run prod --log-date-format="YYYY-MM-DD HH:mm Z"
