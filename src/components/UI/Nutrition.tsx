"use client"
import { useGeneratePetNutritionPDF } from "@/hooks/PetNutrition";
import React, { useState } from "react";


const PetNutritionForm = () => {
  const [petType, setPetType] = useState("dog");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const generatePetNutritionPDF = useGeneratePetNutritionPDF(); // Use the new hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPdfUrl(""); // Reset PDF URL on submit

    try {
      const url = await generatePetNutritionPDF(
        petType,
        parseInt(age),
        parseFloat(weight)
      );
      setPdfUrl(url); // Set the URL for the generated PDF
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Pet Nutrition PDF Generator</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Pet Type
          </label>
          <select
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="rabbit">Rabbit</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Age (in years)
          </label>
          <input
            placeholder="e.g., 3"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Weight (in kg)
          </label>
          <input
            placeholder="e.g., 10"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className={`mt-4 w-full p-2 text-white rounded-md ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}>
          {loading ? "Generating PDF..." : "Generate PDF"}
        </button>
      </form>

      {pdfUrl && (
        <div className="mt-4">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline">
            Download Your Pet Nutrition Chart
          </a>
        </div>
      )}
    </div>
  );
};

export default PetNutritionForm;
