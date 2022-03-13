const generateMessages = (text) => {
    return {
      text,
      CreatedAt: new Date().toDateString(),
    };
  };
  
  const generateLocationMessage = (url) => {
    return {
      url,
      CreatedAt: new Date().toDateString(),
    };
  };
  module.exports = {
    generateMessages,
    generateLocationMessage,
  };
  