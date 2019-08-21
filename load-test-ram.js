let junkSpace = Buffer.alloc(0);
consume(parseInt((process.env['CONSUME_MEMORY'])| 0) * 1024 * 1024);


function consume(amount) {
  console.log(`[DA-LTRAM] changing junk storage size from ${junkSpace.length} to ${amount}.`);
  junkSpace = Buffer.alloc(amount > 0 ? amount : 0);
  junkSpace.fill(0);
}

function getRamAddHandler(app_name, app_id) {
  return async (req, res) => {
    const param = parseInt(req.params.amount) | 0;
    const amount = param * 1024 * 1024;

    consume(junkSpace.length + amount);

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

    consume(amount);

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

    consume(junkSpace.length - amount);

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