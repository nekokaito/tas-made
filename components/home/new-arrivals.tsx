import ProductGrid from "@/components/products/product-grid";
import products from "@/test/product";
import styles from "./home.module.css";

export default function NewArrivals() {
  const latestProducts = products.slice(-4).reverse();

  return (
    <section
      className={`${styles.section} ${styles.arrivals}`}
      aria-labelledby="arrivals-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <h2 id="arrivals-title" className="loubag-font">
            New arrivals
          </h2>
        </div>
      </div>
      <div className="-mx-4 md:-mx-8">
        <ProductGrid products={latestProducts} />
      </div>
    </section>
  );
}
