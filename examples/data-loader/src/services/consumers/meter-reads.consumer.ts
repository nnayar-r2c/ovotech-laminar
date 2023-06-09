import { EachMessageConsumer } from '@ovotech/laminar-kafkajs';
import { LoggerContext } from '@ovotech/laminar';
import { PgContext } from '@ovotech/laminar-pg';
import { meterReadsInsertQuery, InsertMeterRead } from '../../queries/meter-reads-insert.query';
import { MeterReading } from '../../__generated__/meter-reading.json';

const toMeterRead = ({ serialNumber, date, value }: MeterReading): InsertMeterRead => ({
  serialNumber,
  date,
  value: value.toString(),
});

export const meterReadsConsumer: EachMessageConsumer<MeterReading, Buffer, PgContext & LoggerContext> = async ({
  message,
  logger,
  db,
}) => {
  if (message.decodedValue) {
    logger.info('Meter read recieved', { value: message.decodedValue });
    await meterReadsInsertQuery(db, [toMeterRead(message.decodedValue)]);
  }
};
