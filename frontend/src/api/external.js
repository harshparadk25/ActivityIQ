import API from "./axios"; 

export const analyzeExternalData = () => {
  return API.post("/uploads/external-ingest");
};
