'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('jobs', {
			id: {
				autoIncrement: true,
				type: Sequelize.INTEGER.UNSIGNED,
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
				type: Sequelize.STRING(255),
				allowNull: true
			},
			parameters: {
				type: Sequelize.TEXT('long'),
				allowNull: false
			},
			filename: {
				type: Sequelize.STRING(255),
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
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('jobs');
	}
};
