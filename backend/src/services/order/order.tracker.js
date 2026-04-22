/**
 * SSE Tracker (ORDER-CENTRIC)
 *
 * RULES:
 * - admin events - broadcast to admins
 * - user events - MUST include orderId
 * - routing is based on orderId
 */

const clients = new Set();

/**
 * Subscribe client
 */
export function subscribe(res, { scope, userId = null, orderId = null }) {
  if (scope === 'user' && orderId == null) {
    throw new Error('orderId is required for user subscriptions');
  }

  const client = { res, scope, userId, orderId };

  clients.add(client);

  res.on('close', () => clients.delete(client));
  res.on('error', () => clients.delete(client));
}

/**
 * Emit event
 */
export function emit(event) {
  const fullEvent = {
    ...event,
    meta: {
      timestamp: new Date(),
      ...(event.meta || {})
    }
  };

  const payload = formatSSE(fullEvent);

  for (const client of clients) {
    if (!shouldSend(client, fullEvent)) continue;

    try {
      client.res.write(payload);
    } catch {
      clients.delete(client);
    }
  }
}

/**
 * Routing logic
 */
function shouldSend(client, event) {
  // ADMIN - broadcast
  if (event.scope === 'admin') {
    return client.scope === 'admin';
  }

  // USER - match by orderId ONLY
  if (event.scope === 'user') {
    return (
      client.scope === 'user' &&
      client.orderId === event.orderId
    );
  }

  return false;
}

/**
 * SSE formatter
 */
function formatSSE(event) {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

/**
 * Keeps SSE (Server-Sent Events) connections alive.
 */
export function startHeartbeat(interval = 25000) {
  setInterval(() => {
    for (const client of clients) {
      if (client.res.writableEnded) continue;
      client.res.write(': ping\n\n');
    }
  }, interval);
}
