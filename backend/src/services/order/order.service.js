import * as orderRepo from '../../models/db/repositories/order/order.repository.js';
import * as orderIngRepo from '../../models/db/repositories/order/customOrderIng.repository.js';
import * as orderItemsRepo from '../../models/db/repositories/order/orderItems.repository.js';
import * as mapper from './order.mapper.js';
import { OrderEngine } from '../../models/engine/order.engine.js';
import * as statusHistoryRepo from '../../models/db/repositories/order/orderStatusHistory.repository.js';

/**
 * @typedef {import('../../../types/dto/order.type.js').OrderDTO} OrderDTO
 * @param {number} id
 * @returns {Promise<OrderDTO|null>}
*/
export async function getOrder(id) {
  const order = await orderRepo.getOrderRow(id);
  if (!order) return null;

  const items = await orderItemsRepo.getOrderItems(id);
  const ingredients = await orderIngRepo.getOrderIngredients(id);
  let orderDTO = mapper.toOrderDTO(order, items, ingredients);

  // TODO: Fetch user details once user repo is implemented
  // orderDTO.user = await userRepo.getUser(order.user_id);

  // TODO: Fetch payment details once payment repo is implemented
  // orderDTO.payment = await paymentRepo.getByOrderId(order.id);

  return orderDTO;
}

/**
 * @typedef {import('../../../types/db/order.type.js').Orders[]} orders
 * @returns {Promise<OrderDTO[]|null>}
 */
export async function listOrders() {
  const orders = await orderRepo.listOrders();
  const items = await orderItemsRepo.listItemsByOrderIds(orders.map(o => o.id));
  const ingredients = await orderIngRepo.listIngredientsByOrderIds(orders.map(o => o.id));

  return mapper.toOrderListDTO(orders, items, ingredients);
}

// TODO: Input validation for createOrder data
// TODO: More detailed error messages
export async function createOrder(data) {
  const id = await orderRepo.createOrder(data);

  const order = await orderRepo.getOrderRow(id);
  const items = await orderItemsRepo.getOrderItems(id);
  const ingredients = await orderIngRepo.getOrderIngredients(id);

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
  const order = await orderRepo.getOrderRow(orderId);
  if (!order) throw new Error('Order not found');

  const items = await orderItemsRepo.getOrderItems(orderId);
  const ingredients = await orderIngRepo.getOrderIngredients(orderId);

  const dto = mapper.toOrderDTO(order, items, ingredients);

  // 1. validate with engine
  const validation = OrderEngine.validateTransition(dto, nextStatus);

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  // 2. convert status string - id (DB requirement)
  const statusId = mapStatusToId(nextStatus);

  // 3. update order
  await orderRepo.updateOrderStatus(orderId, statusId);

  // 4. insert history (IMPORTANT)
  await statusHistoryRepo.insertStatusChange(orderId, statusId);

  // 5. return updated order
  const updatedOrder = await orderRepo.getOrderRow(orderId);
  const updatedItems = await orderItemsRepo.getOrderItems(orderId);
  const updatedIngredients = await orderIngRepo.getOrderIngredients(orderId);

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
