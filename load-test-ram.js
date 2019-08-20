let junkSpace = Buffer.alloc(0);


function getRamAddHandler(app_name, app_id) {
  return async (req, res) => {
    const param = parseInt(req.params.amount) | 0;
    const amount = param * 1024 * 1024;

    console.log(`[DA-LTRAM] changing junk storage size from ${junkSpace.length} to ${junkSpace.length + amount}.`);
    junkSpace = Buffer.alloc(junkSpace.length + amount);
    junkSpace.fill(0);

    return res.json({
      name: app_name,
      id: app_id,
      task: `load-test/ram/add/${req.params.amount}`,
      status: 'Done',
      amount: `${param} MB`,
      total: heapSize(),
    });
  };
}

function getRamSetHandler(app_name, app_id) {
  return async (req, res) => {
    const param = parseInt(req.params.amount) | 0;
    const amount = param * 1024 * 1024;

    console.log(`[DA-LTRAM] changing junk storage size from ${junkSpace.length} to ${amount}.`);
    junkSpace = Buffer.alloc(amount);
    junkSpace.fill(0);

    return res.json({
      name: app_name,
      id: app_id,
      task: `load-test/ram/add/${req.params.amount}`,
      status: 'Done',
      amount: `${param} MB`,
      total: heapSize(),
    });
  };
}

function getRamFreeHandler(app_name, app_id) {
  return async (req, res) => {
    const param = parseInt(req.params.amount) | 0;
    const amount = param * 1024 * 1024;
    const newSize = (junkSpace.length - amount) > 0 ? junkSpace.length - amount : 0;

    console.log(`[DA-LTRAM] changing junk storage size from ${junkSpace.length} to ${newSize}.`);
    junkSpace = Buffer.alloc(newSize);

    junkSpace.fill(0);

    return res.json({
      name: app_name,
      id: app_id,
      task: `load-test/ram/free/${req.params.amount}`,
      status: 'Done',
      amount: `${param} MB`,
      total: heapSize(),
    });
  };
}

function heapSize() {
  return `${Math.round(junkSpace.length / 1024 / 1024 * 100) / 100} MB`;
}


module.exports = {
  getRamAddHandler: getRamAddHandler,
  getRamSetHandler: getRamSetHandler,
  getRamFreeHandler: getRamFreeHandler,
  heapSize: heapSize,
};