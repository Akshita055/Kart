import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        console.log(res.data); // debug
        setProducts(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <Navbar />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}