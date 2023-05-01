export function initModules(modules) {
  const result = {};
  for (const [modulePath, importedModule] of Object.entries(modules)) {
    const [fileName, name] = modulePath.split(/\/|\\+/).reverse();
    const subName = fileName.replace(/\.(js|ts)$/, '');
    const { state, getters, actions, mutations } = importedModule;
    if (importedModule.default) {
      throw new Error(`remove export default from ${modulePath}`);
    }
    if (typeof state !== 'function') {
      throw new Error(`state is not function in ${modulePath}`);
    }
    if (!mutations) {
      throw new Error(`mutations is empty in ${modulePath}`);
    }
    if (!getters) {
      console.warn(`getters is empty in ${modulePath}`);
    }
    if (!actions) {
      console.warn(`actions is empty in ${modulePath}`);
    }

    if (!result[name]) {
      result[name] = {};
    }
    const module = result[name];

    if (subName === 'index') {
      Object.assign(module, {
        namespaced: true,
        state: state(),
        getters,
        actions,
        mutations,
      });
    } else {
      if (!module.modules) {
        module.modules = {};
      }
      module.modules[subName] = {
        namespaced: true,
        state: state(),
        getters,
        actions,
        mutations,
      };
    }
  }
  return result;
}
