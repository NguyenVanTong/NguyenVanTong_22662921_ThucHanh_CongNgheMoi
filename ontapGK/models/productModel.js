const { docClient, tableName } = require('../config/dynamodb');

class ProductModel {
	static async getAll() {
		const params = {
			TableName: tableName,
		};

		const result = await docClient.scan(params).promise();
		return result.Items || [];
	}

	static async getById(id) {
		const params = {
			TableName: tableName,
			Key: { id },
		};

		const result = await docClient.get(params).promise();
		return result.Item || null;
	}

	static async create(product) {
		const params = {
			TableName: tableName,
			Item: product,
		};

		await docClient.put(params).promise();
		return product;
	}

	static async update(id, payload) {
		const updateExpressions = [];
		const expressionAttributeNames = {};
		const expressionAttributeValues = {};

		Object.entries(payload).forEach(([key, value]) => {
			updateExpressions.push(`#${key} = :${key}`);
			expressionAttributeNames[`#${key}`] = key;
			expressionAttributeValues[`:${key}`] = value;
		});

		const params = {
			TableName: tableName,
			Key: { id },
			UpdateExpression: `SET ${updateExpressions.join(', ')}`,
			ExpressionAttributeNames: expressionAttributeNames,
			ExpressionAttributeValues: expressionAttributeValues,
			ReturnValues: 'ALL_NEW',
		};

		const result = await docClient.update(params).promise();
		return result.Attributes || null;
	}

	static async delete(id) {
		const existing = await this.getById(id);
		if (!existing) {
			return null;
		}

		const params = {
			TableName: tableName,
			Key: { id },
		};

		await docClient.delete(params).promise();
		return existing;
	}
}

module.exports = ProductModel;
