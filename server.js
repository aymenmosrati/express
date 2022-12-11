const dotenv=require('dotenv');
dotenv.config({path: './config.env'})

const app = require('./app')

// console.log(app.get('env'));
// console.log(process.env);

// 4) START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Àpp running on port ${port}...`);
});
