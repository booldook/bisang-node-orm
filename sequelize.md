# Sequelize
## 설치
```bash
npm i -g sequelize-cli cross-env nodemon pm2 sass # 필수: terminal -> sequelize 명령 수행
```

## migration
```bash
cross-env NODE_ENV=development sequelize db:migrate 
cross-env NODE_ENV=development sequelize db:migrate:undo
cross-env NODE_ENV=development sequelize db:migrate --to 20220415-01-users.js
cross-env NODE_ENV=development sequelize db:migrate:undo:all --to 20220415-01-users.js

cross-env NODE_ENV=development sequelize db:seed:all
cross-env NODE_ENV=development sequelize db:seed:undo
```
[migration/seed](https://sequelize.org/docs/v6/other-topics/migrations/)