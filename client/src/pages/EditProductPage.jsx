import React from "react";
import { useParams } from "react-router-dom";
import AddProductPage from "./AddProductPage";

const EditProductPage = () => {
  const { id } = useParams();
  return <AddProductPage />;
};

export default EditProductPage;
