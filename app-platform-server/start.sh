# pm2 start npm --name app-platform -- run prod
git checkout .
git pull
npm run build
pm2 restart app-platform