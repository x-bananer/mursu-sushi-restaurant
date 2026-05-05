import "./daily-special.css";
import { useState } from "react";

import InputField from "../../shared/input-field/InputField";
import Button from "../../shared/button/Button";

export default function DailySpecial() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const description = form.description.trim();
    const price = parseFloat(form.price);

    if (!name || !description || isNaN(price)) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      setLoading(true);

      console.log("Saving special:", {
        name,
        description,
        price,
      });

      // await api.post("/daily-special", { name, description, price });

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-main" id="page-daily-special">
      <h2 className="admin-section-title">Daily Special</h2>

      <div className="admin-form-group">
        <InputField
          label="Name"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="E.g. Dragon Roll Omakase"
        />

        <InputField
          label="Description"
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Short description of the special"
        />

        <InputField
          label="Price (€)"
          value={form.price}
          onChange={handleChange("price")}
          placeholder="0.00"
        />

        <Button
          variant="accent"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Special"}
        </Button>
      </div>
    </section>
  );
}
