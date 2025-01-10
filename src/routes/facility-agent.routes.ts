import express from "express";
import { getAllFacilityAgents, createFacilityAgent, updateFacilityAgent, deleteFacilityAgent } from "../controller/facility-agent.controller";

const FacilityAgent = express.Router();

// Get all Facility Agents
FacilityAgent.get("/all", getAllFacilityAgents);

// Create a new Facility Agent
FacilityAgent.post("/create", createFacilityAgent);

// Update a Facility Agent by ID
FacilityAgent.put("/update/:id", updateFacilityAgent);

// Delete a Facility Agent by ID
FacilityAgent.delete("/delete/:id", deleteFacilityAgent);

export default FacilityAgent;
