export * from '#lib/utils/switch-case';

/**
 * Checks if the child is a sub class of the parent
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-function-type
export const isSubclass = function isSubclass(child: Function, parent: Function): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let proto = child.prototype;
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  while (proto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    proto = Object.getPrototypeOf(proto);
    if (proto === parent.prototype) return true;
  }
  return false;
};
