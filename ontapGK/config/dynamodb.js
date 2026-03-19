const AWS = require('aws-sdk');

const region = process.env.AWS_REGION || 'ap-southeast-1';
const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
const tableName = process.env.DYNAMODB_TABLE || 'Products';

AWS.config.update({
	region,
	accessKeyId: 'fakeMyKeyId',
	secretAccessKey: 'fakeSecretAccessKey',
});

const dynamodb = new AWS.DynamoDB({ endpoint });
const docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

async function initProductsTable() {
	try {
		await dynamodb
			.describeTable({ TableName: tableName })
			.promise();
	} catch (error) {
		if (error.code !== 'ResourceNotFoundException') {
			throw error;
		}

		await dynamodb
			.createTable({
				TableName: tableName,
				KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
				AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
				ProvisionedThroughput: {
					ReadCapacityUnits: 5,
					WriteCapacityUnits: 5,
				},
			})
			.promise();

		await dynamodb.waitFor('tableExists', { TableName: tableName }).promise();
	}
}

module.exports = {
	docClient,
	tableName,
	initProductsTable,
};
