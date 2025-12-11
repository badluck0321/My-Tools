import { useEffect, useState } from "react";
import { productService } from "../../services/productService";

export default function ProductGrid() {    
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await productService.getProduct();
            setProducts(data);
        };
        fetchData();
    }, []);

    return (
        <div style={styles.grid}>
            {products.map((p, i) => (
                <div key={i} style={styles.card}>
                    <img
                        src={p.photoIds.length > 0 ? p.photoIds[0] : "/no-image.png"}
                        alt={p.name}
                        style={styles.image}
                    />
                    <h4 style={styles.title}>{p.name}</h4>
                </div>
            ))}
        </div>
    );
}

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px",
        padding: "20px"
    },
    card: {
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        textAlign: "center"
    },
    image: {
        width: "100%",
        height: "160px",
        objectFit: "cover",
        borderRadius: "8px"
    },
    title: {
        marginTop: "10px",
        fontSize: "16px",
        fontWeight: "600"
    }
};
