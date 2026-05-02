export * from './adapter';
export * from './extension';
export * from './document';
export * from './reactive';
export * from './schema';
export * from './single-doc';
export * from './transformer';
export { type IdGenerator, nanoid, uuidv4 } from './utils/id-generator';

const env = (
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : {}
) as Record<string, boolean>;
const importIdentifier = '__ $BLOCKSUITE_STORE$ __';

if (env[importIdentifier] === true) {
  // Multiple package copies break constructor checks for shared model types.
  console.error(
    '@linvo-core/store was already imported. This breaks constructor checks and will lead to issues!'
  );
}
env[importIdentifier] = true;
