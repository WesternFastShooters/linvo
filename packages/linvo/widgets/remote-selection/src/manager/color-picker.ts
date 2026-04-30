class RandomPicker<T> {
  private _copyArray: T[];

  private readonly _originalArray: T[];

  constructor(array: T[]) {
    this._originalArray = [...array];
    this._copyArray = [...array];
  }

  private randomIndex(max: number): number {
    return Math.floor(Math.random() * max);
  }

  pick(): T {
    if (this._copyArray.length === 0) {
      this._copyArray = [...this._originalArray];
    }

    const index = this.randomIndex(this._copyArray.length);
    const item = this._copyArray[index];
    this._copyArray.splice(index, 1);
    return item;
  }
}

export const multiPlayersColor = new RandomPicker([
  'var(--linvo-multi-players-purple)',
  'var(--linvo-multi-players-magenta)',
  'var(--linvo-multi-players-red)',
  'var(--linvo-multi-players-orange)',
  'var(--linvo-multi-players-green)',
  'var(--linvo-multi-players-blue)',
  'var(--linvo-multi-players-brown)',
  'var(--linvo-multi-players-grey)',
]);
