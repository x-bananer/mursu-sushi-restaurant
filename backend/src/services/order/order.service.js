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
