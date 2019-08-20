const path = require('path');
const { fork } = require('promisify-child-process');
const matrixInverse = require('matrix-inverse');
const randomFloat = require('random-float');

function generateMatrix(n) {
  let matrix = [];
  for (let i=0; i < n; i++) {
    matrix[i] = [];
    for (let j=0; j < n; j++) {
      matrix[i][j] = randomFloat(-10, 10);
    }
  }
  return matrix;
}

function testCPU(level) {
  const start = new Date();
  const matrix = generateMatrix(level);
  const result = matrixInverse(matrix);
  const end = new Date() - start;

  return `${end}ms`;
}

function getHandler(app_name, app_id) {
  return async (req, res) => {
    const level = parseInt(req.params.level);

    if (!level) {
      return res.status(400).json({
        name: app_name,
        id: app_id,
        task: 'load-test/cpu',
        level: level,
        status: 'ERROR',
        data: `Wrong parameter 'level' value: ${req.params.level}`,
      });
    }

    return res.json({
      name: app_name,
      id: app_id,
      task: 'load-test/cpu',
      level: level,
      data: {
        execution_time: (
          await fork(path.resolve('load-test-cpu.js'), {
            silent: true, maxBuffer: 200 * 1024,
            env: {
              'CPU_LOAD_LEVEL': level,
            }
          })
        ).stdout.toString()
      }
    });
  };
}

if (require.main === module) {
  const level = parseInt(process.env['CPU_LOAD_LEVEL']) | 10;
  process.stdout.write(testCPU(level));
}

module.exports = getHandler;
