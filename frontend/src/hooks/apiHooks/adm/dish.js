import { fetchData } from "../../../utils/fetchData";

export function useCreateDish() {
	const create = async (payload) => {
		return fetchData("/adm/dishes", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	};

	return { create };
}

export function useUpdateDish() {
	const update = async (id, payload) => {
		return fetchData(`/adm/dishes/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	};

	return { update };
}

export function useDeleteDish() {
	const remove = async (id) => {
		return fetchData(`/adm/dishes/${id}`, {
			method: "DELETE",
		});
	};

	return { remove };
}
