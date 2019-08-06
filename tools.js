/**
 * Returns list of environment starting with `prefix` in alphabetical order
 * @param prefix {string} prefix
 * @return {string[]}
 */
function getEnvKeys(prefix) {
    return Object.keys(process.env)
        .filter(entry => entry.startsWith(prefix))
        .sort();
}

module.exports = {
    getEnvKeys: getEnvKeys
};
