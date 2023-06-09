import { readdirSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { convertCommand } from '../../../src/commands/avro';
import { ansiRegex } from '../../../src/helpers';

class Logger {
  public std = '';
  public err = '';

  public info(line: string): void {
    this.std += line.replace(ansiRegex, '') + '\n';
  }

  public error(line: string): void {
    this.err += line.replace(ansiRegex, '') + '\n';
  }

  public clear(): void {
    this.std = '';
    this.err = '';
  }
}

const logger = new Logger();
const generatedDir = join(__dirname, '__generated__');
const avroDir = join(__dirname, '../avro');
const externalReferencesDir = join(__dirname, '../external-references');

describe('Cli', () => {
  beforeEach(() => {
    logger.clear();
    readdirSync(generatedDir)
      .filter((file) => file.endsWith('.ts'))
      .forEach((file) => unlinkSync(join(generatedDir, file)));
  });

  it('Should convert single file', async () => {
    const input = `cmd avro ${join(avroDir, 'ComplexRecord.avsc')} --output-dir ${generatedDir}`;
    convertCommand(logger).parse(input.split(' '));

    const file = readFileSync(join(generatedDir, 'ComplexRecord.avsc.ts'), 'utf8');

    expect(logger.std).toMatchSnapshot();
    expect(file).toMatchSnapshot();
  });

  it('Should convert multiple files', async () => {
    const input1 = join(avroDir, 'ComplexRecord.avsc');
    const input2 = join(avroDir, 'ComplexUnionLogicalTypes.avsc');
    const input = `cmd avro ${input1} ${input2} --output-dir ${generatedDir}`;
    convertCommand(logger).parse(input.split(' '));

    const file1 = readFileSync(join(generatedDir, 'ComplexRecord.avsc.ts'), 'utf8');
    const file2 = readFileSync(join(generatedDir, 'ComplexUnionLogicalTypes.avsc.ts'), 'utf8');

    expect(logger.std).toMatchSnapshot();
    expect(file1).toMatchSnapshot();
    expect(file2).toMatchSnapshot();
  });

  it('Should convert files with logical types', async () => {
    const input1 = join(avroDir, 'ComplexRecord.avsc');
    const input2 = join(avroDir, 'ComplexUnionLogicalTypes.avsc');

    const input = `cmd avro ${input1} ${input2} --output-dir ${generatedDir} --logical-type timestamp-millis=string --logical-type date=string`;
    convertCommand(logger).parse(input.split(' '));

    const file1 = readFileSync(join(generatedDir, 'ComplexRecord.avsc.ts'), 'utf8');
    const file2 = readFileSync(join(generatedDir, 'ComplexUnionLogicalTypes.avsc.ts'), 'utf8');

    expect(logger.std).toMatchSnapshot();
    expect(file1).toMatchSnapshot();
    expect(file2).toMatchSnapshot();
  });

  it('Should convert files with logical types and imports', async () => {
    const input1 = join(avroDir, 'ComplexRecord.avsc');
    const input2 = join(avroDir, 'ComplexUnionLogicalTypes.avsc');

    const input = `cmd avro ${input1} ${input2} --output-dir ${generatedDir} --logical-type-import date=Date:date.js --logical-type-import-default timestamp-millis=Timestamp:timestamp.js`;
    convertCommand(logger).parse(input.split(' '));

    const file1 = readFileSync(join(generatedDir, 'ComplexRecord.avsc.ts'), 'utf8');
    const file2 = readFileSync(join(generatedDir, 'ComplexUnionLogicalTypes.avsc.ts'), 'utf8');

    expect(logger.std).toMatchSnapshot();
    expect(file1).toMatchSnapshot();
    expect(file2).toMatchSnapshot();
  });

  it('Should convert multiple files with external references', async () => {
    const input1 = join(externalReferencesDir, 'Address.avsc');
    const input2 = join(externalReferencesDir, 'CreateUser.avsc');
    const input3 = join(externalReferencesDir, 'Message.avsc');
    const input4 = join(externalReferencesDir, 'UpdateAddress.avsc');
    const input = `cmd avro ${input1} ${input2} ${input3} ${input4} --output-dir ${generatedDir}`;
    convertCommand(logger).parse(input.split(' '));

    const file1 = readFileSync(join(generatedDir, 'Address.avsc.ts'), 'utf8');
    const file2 = readFileSync(join(generatedDir, 'CreateUser.avsc.ts'), 'utf8');
    const file3 = readFileSync(join(generatedDir, 'Message.avsc.ts'), 'utf8');
    const file4 = readFileSync(join(generatedDir, 'UpdateAddress.avsc.ts'), 'utf8');

    expect(logger.std).toMatchSnapshot();
    expect(file1).toMatchSnapshot();
    expect(file2).toMatchSnapshot();
    expect(file3).toMatchSnapshot();
    expect(file4).toMatchSnapshot();
  });

  it('Should convert with defaults as optional', async () => {
    const input1 = join(avroDir, 'ComplexRecord.avsc');
    const input2 = join(avroDir, 'ComplexUnionLogicalTypes.avsc');
    const input = `cmd avro ${input1} ${input2} --defaults-as-optional --output-dir ${generatedDir}`;
    convertCommand(logger).parse(input.split(' '));

    const file1 = readFileSync(join(generatedDir, 'ComplexRecord.avsc.ts'), 'utf8');
    const file2 = readFileSync(join(generatedDir, 'ComplexUnionLogicalTypes.avsc.ts'), 'utf8');

    expect(logger.std).toMatchSnapshot();
    expect(file1).toMatchSnapshot();
    expect(file2).toMatchSnapshot();
  });
});
