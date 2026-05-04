import { useEffect, useState} from "react";
import { fetchData } from "../../../utils/fetchData";

/**
 * Temporary manual login till our auth dev is done
 */
import devLogin from "../../../utils/devLogin";

if (!localStorage.getItem("token")) {
 devLogin();
};

export const useAdmOrders = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const response = await fetchData("/adm/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(response.orders || []);
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return { orders, loadOrders, ordersLoading, ordersError };
};
