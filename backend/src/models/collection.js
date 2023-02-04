import {DataTypes} from 'sequelize';

export default (sequelize) => {
    return sequelize.define('collection', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.TIME,
            allowNull: false
        }
    }, 
    {
        freezeTableName: true,
        updatedAt: false,
    });
}