import amqp from 'amqplib';

const QUEUE_NAME = 'orders';
let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

export async function connectToRabbitMQ(): Promise<void> {
  const url =
    process.env.RABBITMQ_URL ||
    'amqp://pizzapohoda:pizzapohoda_secret@localhost:5672';

  try {
    const conn = await amqp.connect(url);
    connection = conn;
    channel = await conn.createChannel();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    console.log('✅ Connected to RabbitMQ');

    conn.on('error', (err: Error) => {
      console.error('❌ RabbitMQ connection error:', err);
      channel = null;
      connection = null;
    });

    conn.on('close', () => {
      console.warn('⚠️ RabbitMQ connection closed, will retry…');
      channel = null;
      connection = null;
      setTimeout(connectToRabbitMQ, 5000);
    });
  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ:', error);
    setTimeout(connectToRabbitMQ, 5000);
  }
}

export async function publishOrder(
  order: Record<string, unknown>,
): Promise<boolean> {
  if (!channel) {
    console.warn('⚠️ RabbitMQ channel not available — order not published');
    return false;
  }

  try {
    const message = JSON.stringify(order);
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message), {
      persistent: true,
    });
    console.log('📤 Order published to RabbitMQ queue:', QUEUE_NAME);
    return true;
  } catch (error) {
    console.error('❌ Failed to publish order to RabbitMQ:', error);
    return false;
  }
}

export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
  } catch {
    // Ignore close errors during shutdown
  }
}
