import { Kafka, type Consumer, type Producer } from "kafkajs";
import { env } from "./env";

let kafkaInstance: Kafka | null = null;
let producer: Producer | null = null;
const consumers: Map<string, Consumer> = new Map();

export const getKafka = (): Kafka => {
  if (!kafkaInstance) {
    kafkaInstance = new Kafka({
      clientId: env.kafka.clientId,
      brokers: env.kafka.brokers,
      ssl: false,
      retry: {
        retries: 5,
        initialRetryTime: 300,
      },
    });

    console.debug("## Kafka Client Created (Singleton)");
  }

  return kafkaInstance;
};

export const getKafkaProducer = (): Producer => {
  if (!producer) {
    producer = getKafka().producer();
  }
  return producer;
};

export const getKafkaConsumer = (groupId: string): Consumer => {
  if (!consumers.has(groupId)) {
    const c = getKafka().consumer({ groupId });
    consumers.set(groupId, c);
  }
  return consumers.get(groupId)!;
};

export async function testKafkaConnection(): Promise<void> {
  if (!env.kafka.enabled) {
    console.debug("## Kafka disabled. Skipping Kafka connection test.");
    return;
  }

  try {
    const p = getKafkaProducer();
    await p.connect();
    console.debug("## Kafka Producer Connected Successfully");
    await p.disconnect();
  } catch (err) {
    console.error("## Kafka Connection Failed");
    console.error(err);
    process.exit(1);
  }
}
