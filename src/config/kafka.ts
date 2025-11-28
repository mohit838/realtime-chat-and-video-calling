import { Kafka, type Consumer, type Producer } from "kafkajs";
import { env } from "./env.js";

let kafkaInstance: Kafka | null = null;
let producer: Producer | null = null;
const consumers: Map<string, Consumer> = new Map();

// Default topics auto-created
const DEFAULT_TOPICS = [
  { topic: "chat-message", numPartitions: 3 },
  { topic: "presence-events", numPartitions: 3 },
  { topic: "call-events", numPartitions: 3 },
];

export const getKafka = (): Kafka => {
  if (!kafkaInstance) {
    kafkaInstance = new Kafka({
      clientId: env.kafka.clientId,
      brokers: env.kafka.brokers,
      ssl: false,
      connectionTimeout: 5000,
      requestTimeout: 30000,
      retry: {
        initialRetryTime: 300,
        retries: 10,
      },
    });

    console.info("## Kafka Client Created");
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

/**
 * Ensure all required topics exist before app starts
 */
async function ensureDefaultTopics(): Promise<void> {
  const kafka = getKafka();
  const admin = kafka.admin();

  try {
    await admin.connect();
    console.info("## Kafka Admin Connected");

    await admin.createTopics({
      topics: DEFAULT_TOPICS,
      waitForLeaders: true,
    });

    console.info(`## Kafka Topics Ready: ${DEFAULT_TOPICS.map((t) => t.topic).join(", ")}`);
  } catch (error) {
    console.error("## Kafka Topic Creation Failed");
    console.error(error);
    process.exit(1);
  } finally {
    await admin.disconnect();
  }
}

/**
 * Test full Kafka connectivity at startup
 */
export async function testKafkaConnection(): Promise<void> {
  if (!env.kafka.enabled) {
    console.info("## Kafka disabled. Skipping connection test.");
    return;
  }

  const kafka = getKafka();

  /** 1. Test broker connectivity */
  try {
    const p = kafka.producer();
    await p.connect();
    console.info("## Kafka Producer Connected Successfully");
    await p.disconnect();
  } catch (err) {
    console.error("## Kafka Connection Failed");
    console.error(err);
    process.exit(1);
  }

  /** 2. Create topics safely */
  await ensureDefaultTopics();
}
