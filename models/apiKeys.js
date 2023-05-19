import Sequelize from 'sequelize';

export default function (sequelize, DataTypes) {
    return sequelize.define('apiKeys', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    }, 
    {});
};
