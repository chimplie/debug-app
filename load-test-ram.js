let junkSpace = Buffer.alloc(0);;


function getRamAddHandler(app_name, app_id) {
  return async (req, res) => {
    const amount = parseInt(req.params.amount);

    if (!amount) {
      return res.status(400).json({
        name: app_name,
        id: app_id,
        task: 'load-test/ram/add',
        status: 'ERROR',
        data: `Wrong parameter 'amount' value: ${req.params.amount}`,
      });
    }

    console.log(`[DA-LTRAM] changing junk storage size from ${heapSize()} to ${newSize}.`);
    junkSpace = Buffer.alloc(junkSpace.length + amount);
    junkSpace.fill(0);

    return res.json({
      name: app_name,
      id: app_id,
      task: `load-test/ram/add/${amount}`,
      status: 'Done',
      amount: amount,
      total: heapSize(),
    });
  };
}

function getRamFreeHandler(app_name, app_id) {
  return async (req, res) => {
    const amount = parseInt(req.params.amount);

    if (!amount) {
      return res.status(400).json({
        name: app_name,
        id: app_id,
        task: 'load-test/ram/free',
        status: 'ERROR',
        data: `Wrong parameter 'amount' value: ${req.params.amount}`,
      });
    }

    const newSize = (junkSpace.length - amount) > 0 ? junkSpace.length - amount : 0;
    console.log(`[DA-LTRAM] changing junk storage size from ${heapSize()} to ${newSize}.`);
    junkSpace = Buffer.alloc(newSize);

    junkSpace.fill(0);

    return res.json({
      name: app_name,
      id: app_id,
      task: `load-test/ram/free/${amount}`,
      status: 'Done',
      amount: amount,
      total: heapSize(),
    });
  };
}

function heapSize() {
  return junkSpace.length;
}


module.exports = {
  getRamAddHandler: getRamAddHandler,
  getRamFreeHandler: getRamFreeHandler,
  heapSize: heapSize,
};