import { Kafka, logLevel, type Consumer, type Producer } from "kafkajs";
import { env } from "./env.js";

let kafkaInstance: Kafka | null = null;
let producer: Producer | null = null;
const consumers: Map<string, Consumer> = new Map();

// Default topics
const DEFAULT_TOPICS = [
  { topic: "chat-message", numPartitions: 3 },
  { topic: "presence-events", numPartitions: 3 },
  { topic: "call-events", numPartitions: 3 },
];

/**
 * Singleton Kafka Client
 */
export const getKafka = (): Kafka => {
  if (!kafkaInstance) {
    kafkaInstance = new Kafka({
      clientId: env.KAFKA_CLIENT_ID,
      brokers: env.KAFKA_BROKERS,
      ssl: false,
      logLevel: logLevel.NOTHING, // prevent console noise
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

/**
 * Singleton Kafka Producer
 */
export const getKafkaProducer = (): Producer => {
  if (!producer) {
    producer = getKafka().producer({
      // Always partition by 0 (only during dev)
      createPartitioner: () => () => 0,
    });
  }
  return producer;
};

/**
 * Singleton Kafka Consumer (per group)
 */
export const getKafkaConsumer = (groupId: string): Consumer => {
  if (!consumers.has(groupId)) {
    const consumer = getKafka().consumer({ groupId });
    consumers.set(groupId, consumer);
  }
  return consumers.get(groupId)!;
};

/**
 * Create topics safely if not exist
 */
async function ensureDefaultTopics(): Promise<void> {
  const admin = getKafka().admin();

  try {
    await admin.connect();
    console.info("## Kafka Admin Connected");

    const existing = await admin.listTopics();
    const topicsToCreate = DEFAULT_TOPICS.filter((t) => !existing.includes(t.topic));

    if (topicsToCreate.length === 0) {
      console.info("## Default Kafka Topics Already Exist — Skipping");
      return;
    }

    await admin.createTopics({
      waitForLeaders: true,
      topics: topicsToCreate,
    });

    console.info("## Kafka Topics Created:", topicsToCreate.map((t) => t.topic).join(", "));
  } catch (err) {
    console.error("## Kafka Topic Creation Error (Non-Fatal)");
    console.error(err);
  } finally {
    await admin.disconnect().catch(() => {});
  }
}

/**
 * Test Kafka connectivity and initialize topics
 */
export async function testKafkaConnection(): Promise<void> {
  if (!env.KAFKA_ENABLED) {
    console.info("## Kafka Disabled — Skipping Initialization");
    return;
  }

  const p = getKafkaProducer();

  try {
    await p.connect();
    console.info("## Kafka Producer Connected Successfully");

    await ensureDefaultTopics();
  } catch (err) {
    console.error("## Kafka Connection Failed");
    console.error(err);
    process.exit(1);
  } finally {
    await p.disconnect().catch(() => {});
  }
}
