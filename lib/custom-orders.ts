export type CustomOrderStatus =
  "pending" | "quoted" | "accepted" | "rejected" | "cancelled";

export type CustomOrder = {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  customerName: string;
  contact: string;
  referenceProductId: number | null;
  photo: Blob | null;
  status: CustomOrderStatus;
  quotedPrice: number | null;
  adminNote: string;
  acceptedAt: string | null;
};

const DATABASE_NAME = "tas-made-custom-orders";
const STORE_NAME = "orders";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runRequest<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    let result: T;
    request.onsuccess = () => {
      result = request.result;
    };
    transaction.oncomplete = () => {
      database.close();
      resolve(result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

export async function getCustomOrders(): Promise<CustomOrder[]> {
  const orders = await runRequest<CustomOrder[]>("readonly", (store) =>
    store.getAll(),
  );
  return orders
    .map((order) =>
      order.status === "accepted" && !order.acceptedAt
        ? { ...order, status: "quoted" as const, acceptedAt: null }
        : order,
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveCustomOrder(order: CustomOrder): Promise<IDBValidKey> {
  return runRequest("readwrite", (store) => store.put(order));
}
