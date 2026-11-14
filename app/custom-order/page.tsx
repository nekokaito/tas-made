"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ImagePlus, PackageOpen } from "lucide-react";
import products from "@/test/product";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/types/product";
import {
  getCustomOrders,
  saveCustomOrder,
  type CustomOrder,
} from "@/lib/custom-orders";
import styles from "./custom-order.module.css";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function Photo({ photo, alt }: { photo: Blob; alt: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => setUrl(String(reader.result));
    reader.readAsDataURL(photo);
    return () => reader.abort();
  }, [photo]);

  return url ? (
    <Image
      src={url}
      alt={alt}
      width={420}
      height={280}
      unoptimized
      className={styles.photo}
    />
  ) : null;
}

function statusLabel(status: CustomOrder["status"]) {
  const labels = {
    pending: "Pending review",
    quoted: "Quote ready",
    accepted: "Proposal accepted",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };
  return labels[status];
}

function productFromCustomOrder(order: CustomOrder): Product {
  const reference = products.find(
    (product) => product.id === order.referenceProductId,
  );
  return {
    id: -parseInt(order.id.replaceAll("-", "").slice(0, 12), 16),
    customOrderId: order.id,
    name: order.title,
    price: order.quotedPrice ?? 0,
    image: reference?.image ?? "/tas-logo.png",
    description: order.description,
  };
}

export default function CustomOrderPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [referenceProductId, setReferenceProductId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [mockPrice, setMockPrice] = useState("");
  const [mockNote, setMockNote] = useState("");
  const addCustomOrderItem = useCartStore((state) => state.addCustomOrderItem);
  const bagItems = useCartStore((state) => state.items);
  const selected = orders.find((order) => order.id === selectedId);
  const referenceProduct = selected
    ? products.find((product) => product.id === selected.referenceProductId)
    : null;

  useEffect(() => {
    getCustomOrders()
      .then(setOrders)
      .catch(() =>
        setError("We couldn't load your saved requests on this device."),
      )
      .finally(() => setLoading(false));
  }, []);

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const order: CustomOrder = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: title.trim(),
      description: description.trim(),
      customerName: customerName.trim(),
      contact: contact.trim(),
      referenceProductId: referenceProductId
        ? Number(referenceProductId)
        : null,
      photo,
      status: "pending",
      quotedPrice: null,
      adminNote: "",
      acceptedAt: null,
    };

    try {
      await saveCustomOrder(order);
      setOrders((current) => [order, ...current]);
      setSelectedId(order.id);
      setMockPrice("");
      setMockNote("");
      setView("list");
      setTitle("");
      setDescription("");
      setCustomerName("");
      setContact("");
      setReferenceProductId("");
      setPhoto(null);
    } catch {
      setError("Your request could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function cancelRequest() {
    if (!selected || selected.status !== "pending") return;
    setSaving(true);
    setError("");
    const updated: CustomOrder = { ...selected, status: "cancelled" };
    try {
      await saveCustomOrder(updated);
      setOrders((current) =>
        current.map((order) => (order.id === updated.id ? updated : order)),
      );
    } catch {
      setError("Your request could not be cancelled. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function acceptProposal() {
    if (
      !selected ||
      selected.status !== "quoted" ||
      selected.quotedPrice === null
    )
      return;
    setSaving(true);
    setError("");
    const updated: CustomOrder = {
      ...selected,
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    };
    try {
      await saveCustomOrder(updated);
      await useCartStore.persist.rehydrate();
      addCustomOrderItem(productFromCustomOrder(updated));
      setOrders((current) =>
        current.map((order) => (order.id === updated.id ? updated : order)),
      );
    } catch {
      setError("The proposal could not be accepted. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function applyMockDecision(status: CustomOrder["status"]) {
    if (
      !selected ||
      selected.status === "accepted" ||
      selected.status === "cancelled"
    )
      return;
    const price = Number(mockPrice);
    if (status === "quoted" && (!Number.isFinite(price) || price <= 0)) {
      setError("Enter a quoted cost greater than zero to send a proposal.");
      return;
    }
    setSaving(true);
    setError("");
    const updated: CustomOrder = {
      ...selected,
      status,
      quotedPrice: status === "quoted" ? price : null,
      adminNote: status === "pending" ? "" : mockNote.trim(),
    };
    try {
      await saveCustomOrder(updated);
      setOrders((current) =>
        current.map((order) => (order.id === updated.id ? updated : order)),
      );
    } catch {
      setError("The demo status could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function choosePhoto(file: File | undefined) {
    if (!file) {
      setPhoto(null);
      return;
    }
    if (
      !ALLOWED_PHOTO_TYPES.includes(file.type) ||
      file.size > MAX_PHOTO_SIZE
    ) {
      setError("Choose a JPG, PNG, or WebP image smaller than 5 MB.");
      setPhoto(null);
      return;
    }
    setError("");
    setPhoto(file);
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link href="/" className={styles.backHome}>
          <ArrowLeft size={16} /> Back to home
        </Link>
        <header className={styles.header}>
          
          <h1 className="loubag-font">Your custom order</h1>
          <p>
            Tell us what you imagine. A color, a character, a little gift, or
            something entirely your own.
          </p>
        </header>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {view === "form" ? (
          <section className={styles.panel} aria-labelledby="form-title">
            <button
              type="button"
              className={styles.textButton}
              onClick={() => {
                setView("list");
                setError("");
              }}
            >
              <ArrowLeft size={16} /> My requests
            </button>
            <h2 id="form-title" className="loubag-font">
              Let&apos;s make something lovely.
            </h2>
            <p className={styles.helper}>
              Share as much detail as you can. You can attach a picture or point
              us to a product you already love.
            </p>
            <form onSubmit={submitOrder} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="order-title">
                  What would you like us to make? <span>*</span>
                </label>
                <input
                  id="order-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. A tiny sunflower bouquet"
                  required
                  maxLength={100}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="order-description">
                  Tell us about your idea <span>*</span>
                </label>
                <textarea
                  id="order-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Size, colors, details, occasion, or anything else we should know…"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={6}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="reference-product">
                  Inspired by one of our products? <em>Optional</em>
                </label>
                <select
                  id="reference-product"
                  value={referenceProductId}
                  onChange={(event) =>
                    setReferenceProductId(event.target.value)
                  }
                >
                  <option value="">No product reference</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="reference-photo">
                  Add a reference picture <em>Optional</em>
                </label>
                <label className={styles.upload} htmlFor="reference-photo">
                  <ImagePlus size={22} />
                  <span>
                    {photo ? photo.name : "Choose a JPG, PNG, or WebP image"}
                  </span>
                  <small>Up to 5 MB</small>
                </label>
                <input
                  id="reference-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => choosePhoto(event.target.files?.[0])}
                  className={styles.fileInput}
                />
              </div>
              <div className={styles.twoFields}>
                <div className={styles.field}>
                  <label htmlFor="customer-name">
                    Your name <span>*</span>
                  </label>
                  <input
                    id="customer-name"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Your name"
                    required
                    maxLength={100}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="customer-contact">
                    Email or phone <span>*</span>
                  </label>
                  <input
                    id="customer-contact"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="How can we reach you?"
                    required
                    maxLength={120}
                  />
                </div>
              </div>
              <p className={styles.notice}>
                Demo mode: your request is saved on this device. You can preview
                the review steps after saving it.
              </p>
              <button
                className={styles.primaryButton}
                type="submit"
                disabled={saving}
              >
                {" "}
                {saving ? "Saving…" : "Save my idea"} <ArrowRight size={18} />
              </button>
            </form>
          </section>
        ) : selected ? (
          <section className={styles.panel} aria-labelledby="detail-title">
            <button
              type="button"
              className={styles.textButton}
              onClick={() => {
                setSelectedId(null);
                setError("");
              }}
            >
              <ArrowLeft size={16} /> All requests
            </button>
            <div className={styles.detailHeading}>
              <div>
                <p className={styles.eyebrow}>
                  Request #{selected.id.slice(0, 8).toUpperCase()}
                </p>
                <h2 id="detail-title" className="loubag-font">
                  {selected.title}
                </h2>
              </div>
              <span className={`${styles.status} ${styles[selected.status]}`}>
                {statusLabel(selected.status)}
              </span>
            </div>
            <p className={styles.date}>
              Sent{" "}
              {new Date(selected.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {selected.photo && (
              <div className={styles.detailPhoto}>
                <Photo
                  photo={selected.photo}
                  alt="Your reference for this custom order"
                />
              </div>
            )}
            <div className={styles.detailGrid}>
              <div>
                <h3>Your idea</h3>
                <p className={styles.multiline}>{selected.description}</p>
              </div>
              <div>
                <h3>Reference product</h3>
                {referenceProduct ? (
                  <Link
                    href={`/product/${referenceProduct.id}`}
                    className={styles.productLink}
                  >
                    <Image
                      src={referenceProduct.image}
                      alt=""
                      width={56}
                      height={56}
                    />
                    {referenceProduct.name}
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <p>None selected</p>
                )}
              </div>
              <div>
                <h3>Contact</h3>
                <p>
                  {selected.customerName}
                  <br />
                  {selected.contact}
                </p>
              </div>
            </div>
            <div className={styles.response}>
              {selected.status === "pending" && (
                <>
                  <h3>We have your idea ♡</h3>
                  <p>
                    Your idea is pending review. Use the demo controls below to
                    preview the next steps.
                  </p>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    disabled={saving}
                    onClick={cancelRequest}
                  >
                    {saving ? "Cancelling…" : "Cancel request"}
                  </button>
                </>
              )}
              {selected.status === "quoted" && (
                <>
                  <h3>Your proposal is ready</h3>
                  {selected.adminNote && <p>{selected.adminNote}</p>}
                  <p className={styles.price}>
                    Quoted cost: ${selected.quotedPrice?.toLocaleString()}
                  </p>
                  <p>
                    Accept this proposal to add your custom piece to your bag.
                    Once accepted, the request cannot be cancelled.
                  </p>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={saving}
                    onClick={acceptProposal}
                  >
                    {saving ? "Accepting…" : "Accept proposal and add to bag"}{" "}
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
              {selected.status === "rejected" && (
                <>
                  <h3>We can&apos;t make this one</h3>
                  <p>
                    {selected.adminNote ||
                      "This request was declined. You can always send us another idea."}
                  </p>
                </>
              )}
              {selected.status === "accepted" && (
                <>
                  <h3>Proposal accepted!</h3>
                  {selected.adminNote && <p>{selected.adminNote}</p>}
                  <p className={styles.price}>
                    Agreed cost:{" "}
                    {selected.quotedPrice === null
                      ? "Awaiting quote"
                      : `$${selected.quotedPrice.toLocaleString()}`}
                  </p>
                  {bagItems.some(
                    (item) => item.product.customOrderId === selected.id,
                  ) ? (
                    <Link href="/bag" className={styles.bagLink}>
                      View in your bag <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={styles.bagLink}
                      onClick={() =>
                        addCustomOrderItem(productFromCustomOrder(selected))
                      }
                    >
                      Add back to bag <ArrowRight size={16} />
                    </button>
                  )}
                  <p className={styles.lockedNote}>
                    This request can no longer be cancelled.
                  </p>
                </>
              )}
              {selected.status === "cancelled" && (
                <>
                  <h3>Request cancelled</h3>
                  <p>
                    You cancelled this request while it was pending. You can
                    start a new custom order whenever you like.
                  </p>
                </>
              )}
            </div>
            {selected.status !== "accepted" &&
              selected.status !== "cancelled" && (
                <details className={styles.mockReview}>
                  <summary>
                    Preview admin review <span>Demo only</span>
                  </summary>
                  <p>
                    Try each decision to see what a customer would see. Changes
                    stay on this device.
                  </p>
                  <div className={styles.mockFields}>
                    <div className={styles.field}>
                      <label htmlFor="mock-price">
                        Quoted cost (for proposal)
                      </label>
                      <input
                        id="mock-price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={mockPrice}
                        onChange={(event) => setMockPrice(event.target.value)}
                        placeholder="e.g. 45"
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="mock-note">Review note (optional)</label>
                      <input
                        id="mock-note"
                        value={mockNote}
                        onChange={(event) => setMockNote(event.target.value)}
                        placeholder="A message for the customer"
                        maxLength={300}
                      />
                    </div>
                  </div>
                  <div className={styles.mockActions}>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => applyMockDecision("quoted")}
                    >
                      Send quote
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => applyMockDecision("rejected")}
                    >
                      Reject request
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => applyMockDecision("pending")}
                    >
                      Reset to pending
                    </button>
                  </div>
                </details>
              )}
          </section>
        ) : loading ? (
          <div className={styles.empty} role="status">
            Loading your requests…
          </div>
        ) : orders.length === 0 ? (
          <section className={styles.empty} aria-labelledby="empty-title">
            <div className={styles.emptyIcon}>
              <PackageOpen size={35} strokeWidth={1.4} />
            </div>
            <p className={styles.eyebrow}>Something made just for you</p>
            <h2 id="empty-title" className="loubag-font">
              Try your first custom order.
            </h2>
            <p>
              Have an idea in mind? Save a few details and a reference picture
              to start your request.
            </p>
            <button
              className={styles.primaryButton}
              onClick={() => setView("form")}
            >
              Start a custom order <ArrowRight size={18} />
            </button>
          </section>
        ) : (
          <section aria-labelledby="list-title">
            <div className={styles.listHeader}>
              <div>
                <p className={styles.eyebrow}>Your ideas</p>
                <h2 id="list-title" className="loubag-font">
                  Custom requests
                </h2>
              </div>
              <button
                className={styles.primaryButton}
                onClick={() => setView("form")}
              >
                New request <ArrowRight size={18} />
              </button>
            </div>
            <div className={styles.cards}>
              {orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className={styles.card}
                  onClick={() => {
                    setSelectedId(order.id);
                    setMockPrice(order.quotedPrice?.toString() ?? "");
                    setMockNote(order.adminNote);
                  }}
                >
                  <div className={styles.cardImage}>
                    {order.photo ? (
                      <Photo photo={order.photo} alt="" />
                    ) : (
                      <ImagePlus size={30} strokeWidth={1.2} />
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <span
                      className={`${styles.status} ${styles[order.status]}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                    <h3>{order.title}</h3>
                    <p>{order.description}</p>
                    <small>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <ArrowRight className={styles.cardArrow} size={20} />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
