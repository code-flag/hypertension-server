import express from "express";
import { getAllFacilities, createFacility, updateFacility, deleteFacility } from "../controller/facility.controller";

const Facility = express.Router();

// Create a new Facility 
Facility.post("/create", createFacility);
// Get all Facility 
Facility.get("/all", getAllFacilities);
// Update a Facility  by ID
Facility.put("/update/:id", updateFacility);

// Delete a Facility  by ID
Facility.delete("/delete/:id", deleteFacility);

export default Facility;
