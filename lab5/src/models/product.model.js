const dynamoDB = require('../config/dynamodb');

const TABLE_NAME = process.env.PRODUCTS_TABLE;

exports.create = async (product) => {
  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: product,
  }).promise();

  return product;
};

exports.findAll = async () => {
  const result = await dynamoDB.scan({
    TableName: TABLE_NAME,
  }).promise();

  return result.Items;
};

exports.findById = async (id) => {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: { id },
  }).promise();

  return result.Item;
};

exports.update = async (id, data) => {
  const result = await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET #n = :n, price = :p, url_image = :u',
    ExpressionAttributeNames: {
      '#n': 'name',
    },
    ExpressionAttributeValues: {
      ':n': data.name,
      ':p': data.price,
      ':u': data.url_image,
    },
    ReturnValues: 'ALL_NEW',
  }).promise();

  return result.Attributes;
};

exports.remove = async (id) => {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: { id },
  }).promise();
};
