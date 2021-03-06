export class ArgumentParser {
  /**
   * Private list of all arguments that were found
   */
  private args: string[];

  /**
   * Creates a new instance of the argument parser
   * @param raw The raw arguments supplied
   */
  constructor(raw: string[]) {
    this.args = raw;
  }

  /**
   * Gets the raw arguments
   */
  get raw() {
    return this.args;
  }

  /**
   * Gets the argument by it's index
   * @param i The argument index
   */
  get(i: number) {
    return this.args[i];
  }

  /**
   * Check if the argument is empty
   * @param i The argument index
   */
  empty(i: number) {
    return !this.args[i];
  }

  /**
   * Slices all arguments and conjoins into a new argument parser
   * @param start The start of the slice process
   * @param end The end of the slice process
   */
  slice(start: number, end?: number) {
    const newArgs = this.args.slice(start, end);
    return new ArgumentParser(newArgs);
  }

  /**
   * Joins all arguments into a string
   * @param sep The seperator to conjoin the arguments
   */
  join(sep: string = ' ') {
    return this.args.join(sep);
  }
}
