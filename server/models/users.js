const { DataTypes } = require('Sequelize');
const sequelize = require('../db/database');

const bcrypt = require('bcrypt');

const userSchema = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
}, {
    hooks: {
        afterValidate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
    },
    instanceMethods: {
        validPassword: (password) => {
            return bcrypt.compareSync(password, this.password);
        }
    },
    timestamps: true,
    freezeTableName: true,
});

module.exports = userSchema;