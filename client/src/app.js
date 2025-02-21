import React, { useEffect, useState } from "react";

const App = () => {
  const [tableData, setTableData] = useState([]);
  const [formValues, setFormValues] = useState({
    name: "",
    color: "",
    number: 0,
    food: "pizza"
  });

  useEffect(() => {
    fetch("http://localhost:5000/namesData", { credentials: "include" })
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Data:", data);
        if (Array.isArray(data)) {
          setTableData(data);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch(error => console.error("Error loading names:", error));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if (!formValues.name.trim()) {
      alert("Please enter a name.");
      return;
    }

    const formData = {
      ...formValues,
      number: parseInt(formValues.number, 10) || 0,
      name: formValues.name.trim(),
      color: formValues.color.trim(),
      food: formValues.food.trim()
    };

    console.log("Submitting Data:", formData);

    try {
      const response = await fetch("http://localhost:5000/namesData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok && result.newEntry) {
        setTableData((prevData) => [...prevData, result.newEntry]);
        setFormValues({ name: "", color: "", number: 0, food: "pizza" });
      } else {
        alert("Error adding name.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div>
      <h1>Submit Your Info</h1>
      <form id="nameForm" onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          placeholder="Name"
          required
          value={formValues.name}
          onChange={handleChange}
        />
        <input
          type="text"
          id="color"
          placeholder="Favorite Color"
          required
          value={formValues.color}
          onChange={handleChange}
        />
        <input
          type="number"
          id="number"
          placeholder="Favorite Number"
          required
          value={formValues.number}
          onChange={handleChange}
        />
        <select id="food" value={formValues.food} onChange={handleChange}>
          <option value="pizza">Pizza</option>
          <option value="sushi">Sushi</option>
          <option value="steak">Steak</option>
          <option value="tacos">Tacos</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Color</th>
            <th>Number</th>
            <th>Food</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="4">No Data Available</td>
            </tr>
          ) : (
            tableData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.color}</td>
                <td>{entry.number}</td>
                <td>{entry.food}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
