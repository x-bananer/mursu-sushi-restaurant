import { useEffect, useState } from "react";
import { fetchData } from "../../utils/fetchData";

/**
 * Temporary manual login till our auth dev is done
 */
import devLogin from "../../utils/devLogin";

if (!localStorage.getItem("token")) {
 devLogin();
};


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
  		  headers: {
    	    Authorization: `Bearer ${localStorage.getItem("token")}`,
  		  },
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
