import { Command } from 'commander';
import logger from '../logging';
import { z, ZodObject } from 'zod';

type CommandExec<T> = (args: z.output<T>) => Promise<void>;

type Config<T> = {
  program: Command;
  schema: T;
};

export async function runner<T extends ZodObject>(config: Config<T>, exec: CommandExec<T>) {
  const { program, schema } = config;
  try {
    const args = parseArgs(schema, program);
    logger.info({ args }, `Starting command ${program.name()}`);
    await exec(args);
    logger.info(`Command ${program.name()} finished successfully`);
    process.exit();
  } catch (error) {
    logger.error({ err: error }, `Command ${program.name()} failed`);
    process.exit(1);
  }
}

export function parseArgs<T extends ZodObject>(schema: T, program: Command) {
  const result = schema.safeParse(program.opts());
  if (!result.success) {
    program.error(z.prettifyError(result.error)); // exits with code 1
  }
  return result.data;
}
