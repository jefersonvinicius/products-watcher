import { program } from 'commander';
import { searchTermsUseCase } from '../usecases/search-terms-usecase';
import { runner } from './runner';
import { z } from 'zod';

const schema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

program
  .option('--offset <number>', 'Offset to skip terms')
  .option('--limit <number>', 'Limit of terms to be processed');
program.parse();

runner({ program, schema }, async (options) => {
  await searchTermsUseCase(options);
});
