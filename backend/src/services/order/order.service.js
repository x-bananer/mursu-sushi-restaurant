import * as OrderRepo from '../../models/db/repositories/order/order.repository.js';
import * as mapper from './order.mapper.js';
import { OrderEngine } from '../../models/engine/order.engine.js';
import * as statusHistoryRepo from '../../models/db/repositories/order/orderStatusHistory.repository.js';

export async function getOrder(id) {
  const order = await OrderRepo.getOrderRow(id);
  if (!order) return null;

  const items = await OrderRepo.getOrderItems(id);
  const ingredients = await OrderRepo.getOrderIngredients(id);
  let orderDTO = mapper.toOrderDTO(order, items, ingredients);

  // TODO: Fetch user details once user repo is implemented
  // orderDTO.user = await userRepo.getUser(order.user_id);

  // TODO: Fetch payment details once payment repo is implemented
  // orderDTO.payment = await paymentRepo.getByOrderId(order.id);

  return orderDTO;
}

export async function listOrders() {
  const rows = await OrderRepo.listOrders();
  return mapper.toOrderListDTO(rows);
}

// TODO: Input validation for createOrder data
// TODO: More detailed error messages
export async function createOrder(data) {
  const id = await OrderRepo.createOrder(data);

  const order = await OrderRepo.getOrderRow(id);
  const items = await OrderRepo.getOrderItems(id);
  const ingredients = await OrderRepo.getOrderIngredients(id);

  let orderDTO = mapper.toOrderDTO(order, items, ingredients);

  // TODO: Fetch user details once user repo is implemented
  // orderDTO.user = await userRepo.getUser(order.user_id);

  // TODO: Fetch payment details once payment repo is implemented
  // orderDTO.payment = await paymentRepo.getByOrderId(order.id);

  return orderDTO;
}

// Helper to convert status string - id for DB
function mapStatusToId(status) {
  return {
    pending: 1,
    confirmed: 2,
    preparing: 3,
    ready: 4,
    delivered: 5,
    cancelled: 6,
  }[status];
}

export async function updateOrderStatus(orderId, nextStatus) {
  const order = await OrderRepo.getOrderRow(orderId);
  if (!order) throw new Error('Order not found');

  const items = await OrderRepo.getOrderItems(orderId);
  const ingredients = await OrderRepo.getOrderIngredients(orderId);

  const dto = mapper.toOrderDTO(order, items, ingredients);

  // 1. validate with engine
  const validation = OrderEngine.validateTransition(dto, nextStatus);

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  // 2. convert status string - id (DB requirement)
  const statusId = mapStatusToId(nextStatus);

  // 3. update order
  await OrderRepo.updateOrderStatus(orderId, statusId);

  // 4. insert history (IMPORTANT)
  await statusHistoryRepo.insertStatusChange(orderId, statusId);

  // 5. return updated order
  const updatedOrder = await OrderRepo.getOrderRow(orderId);
  const updatedItems = await OrderRepo.getOrderItems(orderId);
  const updatedIngredients = await OrderRepo.getOrderIngredients(orderId);

  let updatedDTO = mapper.toOrderDTO(updatedOrder, updatedItems, updatedIngredients);

  // TODO: Fetch user details once user repo is implemented
  // updatedDTO.user = await userRepo.getUser(updatedOrder.user_id);

  // TODO: Fetch payment details once payment repo is implemented
  // updatedDTO.payment = await paymentRepo.getByOrderId(updatedOrder.id);

  return updatedDTO;
}

/**
 * Payment logic to be added here for controlers to call
 * - initiatePayment(orderId, paymentDetails)
 * - confirmPayment(orderId, paymentConfirmation)
 * - paymentStatus(orderId)
 */
