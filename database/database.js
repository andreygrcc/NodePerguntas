const Sequelize = require('sequelize');

const connection = new Sequelize('nodeperguntas', 'root', 'link22',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

module.exports = connection;