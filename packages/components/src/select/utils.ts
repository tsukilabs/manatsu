function uniqueIdCache() {
  let id = 0;

  return function () {
    return id++;
  };
}

export const getUniqueId = uniqueIdCache();
