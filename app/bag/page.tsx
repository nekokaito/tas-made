"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import {
  selectCartItemCount,
  selectCartSubtotal,
  useCartStore,
} from "@/lib/cart-store";
import styles from "./bag.module.css";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

export default function BagPage() {
  const items = useCartStore((state) => state.items);
  const changeQuantity = useCartStore((state) => state.changeQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const itemCount = useCartStore(selectCartItemCount);
  const subtotal = useCartStore(selectCartSubtotal);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.heading}>
          <div>
            <Link href="/products" className={styles.backLink}>
              <ArrowLeft size={17} strokeWidth={1.8} aria-hidden="true" />
              Continue shopping
            </Link>
            <h1>
              Your bag<span className={styles.period}>.</span>
            </h1>
            <p>Handpicked with love, just for you.</p>
          </div>
          <span
            className={styles.count}
            aria-label={`${itemCount} ${itemCount === 1 ? "item" : "items"} in bag`}
          >
            {itemCount}
          </span>
        </div>

        <div className={styles.content}>
          <section
            className={styles.itemsPanel}
            aria-labelledby="bag-items-title"
          >
            <div className={styles.panelHeader}>
              <h2 id="bag-items-title">Your lovely finds</h2>
              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            {items.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <ShoppingBag size={30} strokeWidth={1.4} aria-hidden="true" />
                </div>
                <h3>Nothing in your bag yet</h3>
                <p>There&apos;s always room for something lovely.</p>
                <Link href="/products" className={styles.shopButton}>
                  Explore the shop <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <ul className={styles.itemList}>
                {items.map(({ product, quantity }) => (
                  <li className={styles.item} key={product.id}>
                    <Link
                      href={
                        product.customOrderId
                          ? "/custom-order"
                          : `/product/${product.id}`
                      }
                      className={styles.imageLink}
                      aria-label={`View ${product.name}`}
                    >
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 88px, 112px"
                        className={styles.productImage}
                      />
                    </Link>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemTop}>
                        <div>
                          <span className={styles.itemEyebrow}>
                            {product.customOrderId
                              ? "CUSTOM ORDER · PROPOSAL ACCEPTED"
                              : "TAS MADE FAVORITE"}
                          </span>
                          <Link
                            href={
                              product.customOrderId
                                ? "/custom-order"
                                : `/product/${product.id}`
                            }
                            className={styles.productName}
                          >
                            {product.name}
                          </Link>
                        </div>
                        {!product.customOrderId && (
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => removeItem(product.id)}
                            aria-label={`Remove ${product.name} from bag`}
                          >
                            <Trash2
                              size={17}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </div>
                      <div className={styles.itemBottom}>
                        {product.customOrderId ? (
                          <span className={styles.itemEyebrow}>
                            ONE CUSTOM PIECE
                          </span>
                        ) : (
                          <div
                            className={styles.quantity}
                            aria-label={`Quantity: ${quantity}`}
                          >
                            <button
                              type="button"
                              onClick={() => changeQuantity(product.id, -1)}
                              aria-label={`Decrease ${product.name} quantity`}
                            >
                              <Minus size={14} aria-hidden="true" />
                            </button>
                            <span>{quantity}</span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(product.id, 1)}
                              aria-label={`Increase ${product.name} quantity`}
                            >
                              <Plus size={14} aria-hidden="true" />
                            </button>
                          </div>
                        )}
                        <strong>{formatPrice(product.price * quantity)}</strong>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className={styles.summary} aria-labelledby="summary-title">
            <div className={styles.summaryDecoration} aria-hidden="true">
              ✳
            </div>
            <p className={styles.summaryEyebrow}>A LITTLE SOMETHING SPECIAL</p>
            <h2 id="summary-title">Order summary</h2>
            <div className={styles.summaryRows}>
              <div>
                <span>
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className={styles.total}>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <button
              type="button"
              className={styles.checkout}
              disabled
              title="Checkout is coming soon"
            >
              <span>Make payment</span>
              <span className={styles.checkoutArrow}>
                <ArrowRight size={22} aria-hidden="true" />
              </span>
            </button>
            <p className={styles.checkoutNote}>
              Checkout is coming soon. Your bag is a preview for now.
            </p>
            <div className={styles.summaryFooter}>
              Made slowly. Loved forever. <span aria-hidden="true">♡</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
