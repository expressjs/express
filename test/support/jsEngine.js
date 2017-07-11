module.exports.engineSpecificMessage = function (messageObject) {
  const jsEngine = process.jsEngine || 'v8'; //default is 'v8'
  return messageObject[jsEngine];
};