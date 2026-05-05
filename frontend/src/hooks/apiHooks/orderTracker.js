import { useEffect, useState } from "react";
import { fetchData } from "../../utils/fetchData";

/**
 * GET /orders/active
 */

export const useActiveOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchData("/orders/active", {
  		  method: "GET",
		});

        setOrder(response.order ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, []);

  return { order, loading, error };
};

/**
 * GET /orders/:id/stream
 */

export const useOrderStream = (orderId) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/stream`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener("order_status_updated", (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.payload);
	  if (data.payload.status === "delivered") {
    	eventSource.close();
  	  }
    });

    eventSource.addEventListener("order_created", (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.payload.status);
    });

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [orderId]);

  return status;
};

export const useOrderTracking = (orderId) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTracking = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetchData(
        `/orders/${orderId}/tracking`,
        {
          method: "GET",
        }
      );

      setHistory(response.history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracking();
  }, [orderId]);

  return { history, loadTracking, loading, error };
};

export const useEtaEstimation = (orderId, userCoordsLat, userCoordsLong) => {
  const [etaEstimation, setEtaEstimation] = useState(null);
  const [etaLoading, setEtaLoading] = useState(true);
  const [etaError, setEtaError] = useState(null);

  const loadEtaEstimation = async () => {
  if (!orderId || userCoordsLat == null || userCoordsLong == null) return;

	try {
      setEtaLoading(true);
      setEtaError(null);

      const response = await fetchData(
        `/orders/${orderId}/estimate/${userCoordsLat}/${userCoordsLong}`,
        {
          method: "GET",
        }
      );

      setEtaEstimation(response.estimate || {});
    } catch (err) {
      setEtaError(err.message);
    } finally {
      setEtaLoading(false);
    }
  };

  useEffect(() => {
    loadEtaEstimation();
  }, [orderId, userCoordsLat, userCoordsLong]);

  return { etaEstimation, loadEtaEstimation, etaLoading, etaError  };

}

export const useRouteByMode = (
  orderId,
  lat,
  lon,
  mode
) => {
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);

  const loadRoute = async () => {
    if (!orderId || lat == null || lon == null || !mode) return;

    try {
      setRouteLoading(true);
      setRouteError(null);

      const response = await fetchData(
        `/orders/${orderId}/route/${mode}/${lat}/${lon}`,
        {
          method: "GET",
        }
      );

      setRoute(response.route || null);
    } catch (err) {
      setRouteError(err.message);
    } finally {
      setRouteLoading(false);
    }
  };

  useEffect(() => {
    loadRoute();
  }, [orderId, lat, lon, mode]);

  return { route, routeLoading, routeError, loadRoute };
};
