import Sequelize from 'sequelize';

export default function (sequelize, DataTypes) {
    return sequelize.define('jobs', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        complete: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        success: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        parameters: {
            type: Sequelize.TEXT('long'),
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: true
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
