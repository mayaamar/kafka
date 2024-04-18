const tryCatchWrapper = (func) => {
  return async (msg, doc) => {
    try {
      await func(msg, doc);
    } catch (error) {
      console.log(error.message);
    }
  };
};

export default tryCatchWrapper;
