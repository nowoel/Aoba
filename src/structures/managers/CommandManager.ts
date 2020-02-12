import { promises as fs, readdirSync } from 'fs';
import { Aoba, Command, Logger } from '..';
import { Collection } from '@augu/immutable';
import CommandService from '../services/CommandService';
import * as utils from '../../util';

export default class CommandManager extends Collection<Command> {
  /**
   * The logger instance
   */
  private logger: Logger;

  /**
   * The command's service
   */
  public service: CommandService;

  /**
   * The arbitray path
   */
  public path: string;

  /**
   * The bot instance itself
   */
  public bot: Aoba;

  /**
   * Creates a new instance of the command manager
   * @param bot The bot instance itself 
   */
  constructor(bot: Aoba) {
    super();

    this.service = new CommandService(bot);
    this.logger = new Logger();
    this.path = utils.getArbitrayPath('commands');
    this.bot = bot;
  }

  /**
   * Configures the command manager
   */
  async configure() {
    this.logger.info(`Now registering commands in ${this.logger.colors.gray(this.path)}`);

    const modules = readdirSync(this.path);
    for (const mod of modules) {
      const stats = await fs.stat(utils.getArbitrayPath('commands', mod));
      if (!stats.isDirectory()) {
        this.logger.warn('Received a file in path directory, continuing');
        continue;
      }

      const getCommandPath = (...paths: string[]) => utils.getArbitrayPath('commands', ...paths);
      const files = await fs.readdir(getCommandPath(mod));
      if (!files.length) {
        this.logger.warn(`No commands were found in path ${this.logger.colors.gray(getCommandPath(mod))}`);
        continue;
      }

      this.logger.info(`Found ${files.length} files in module ${mod}`);
      for (const file of files) {
        const instance = await import(getCommandPath(mod, file));
        const command: Command = instance.default ? new instance.default() : new instance();
        if (command.info.disabled && command.info.disabled.is) this.logger.warn(`Command ${command.info.name} is disabled from running for ${command.info.disabled.reason}`);

        this.set(command.info.name, command);
        this.logger.info(`Registered command ${command.info.name}`);
      }
    }
  }
}