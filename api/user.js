

// Require all the stuff
import Sequelize from 'sequelize'
import passportLocalSequelize from 'passport-local-sequelize'
 
// Setup sequelize db connection
const mydb = new Sequelize('cellstore', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres'
});
 
// A helper to define the User model with username, password fields
var User = passportLocalSequelize.defineUser(mydb, {})
User.sync()

export default User
