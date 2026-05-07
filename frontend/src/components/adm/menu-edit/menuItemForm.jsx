import Button from "../../shared/button/Button";
import InputField from "../../shared/input-field/InputField";
import useForm from "../../../hooks/formHooks";

export default function MenuItemForm({
  type, // "ingredient" | "dish"
  initialData = {},
  categories = [],
  onSubmit,
}) {
  const { inputs, handleInputChange, handleSubmit } = useForm(
    onSubmit,
    {
      name: initialData.name || "",
      price: initialData.price || "",
      description: initialData.description || "",
      ingredient_type_id: initialData.ingredient_type_id || "",
      is_available: initialData.is_available ?? true,
    }
  );

  return (
    <form onSubmit={handleSubmit} className="form">

      <InputField
        name="name"
        value={inputs.name}
        onChange={handleInputChange}
        placeholder="Name"
      />

      <InputField
        name="price"
        value={inputs.price}
        onChange={handleInputChange}
        placeholder="Price"
      />

      {type === "dish" && (
        <InputField
          name="description"
          value={inputs.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
      )}

      {type === "ingredient" && (
        <Button>
        <select
          name="ingredient_type_id"
          value={inputs.ingredient_type_id}
          onChange={handleInputChange}
        >
          <option value="">Select type</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Button>
      )}

      <Button type="submit" variant="accent">
        Save
      </Button>
    </form>
  );
}
