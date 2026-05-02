export function defineCustomElement(
  name: string,
  constructor: CustomElementConstructor,
  options?: ElementDefinitionOptions
) {
  const existing = customElements.get(name);
  if (existing) {
    if (existing !== constructor) {
      console.warn(
        `Custom element "${name}" is already registered with a different constructor.`
      );
    }
    return existing;
  }

  customElements.define(name, constructor, options);
  return constructor;
}
