# Development Guide

This document serves as a comprehensive guide for developing features in the **AS Gadget Store** application, specifically focusing on connecting to a backend, managing state, and implementing CRUD operations.

## 1. Architecture Overview

The application follows a standard React architecture:
- **Pages**: Top-level route components.
- **Components**: Reusable UI blocks.
- **Services**:
    - `api.ts`: Centralized API client using native `fetch`.
    - `storeContext.tsx`: Global state management using React Context + Hooks.
    - `mockServer.ts`: MirageJS server to simulate a real backend during development.

### Database Schema
For the data structure used in this project, please refer to [database.md](./database.md).

---

## 2. API Integration

### Option A: Native Fetch (Current Implementation)

We currently use the native `fetch` API wrapped in a helper function to manage headers, authentication, and error handling.

**Location**: `services/api.ts`

**Usage Pattern**:
1.  **Define Endpoints**: Add functions to `api` object.
    ```typescript
    // services/api.ts
    export const api = {
      products: {
        getAll: () => fetchClient<Product[]>('/products'),
        create: (data: Product) => fetchClient<Product>('/products', { data }),
      }
    }
    ```
2.  **Call in Store/Component**:
    ```typescript
    // services/storeContext.tsx
    const addProduct = async (product: Product) => {
      const newProduct = await api.products.create(product);
      setProducts(prev => [newProduct, ...prev]);
    };
    ```

### Option B: Robust Solution (TanStack Query + Axios)

For production-grade applications, we recommend using **TanStack Query (React Query)** for data fetching and caching, combined with **Axios** for HTTP requests.

**Benefits**:
- Automatic caching and background refetching.
- Built-in loading and error states.
- No need for complex global state for server data (removes need for most of `StoreContext`).

**Implementation Guide**:

1.  **Install Dependencies**:
    ```bash
    npm install @tanstack/react-query axios
    ```

2.  **Setup Query Client**:
    ```typescript
    // App.tsx
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    const queryClient = new QueryClient();

    const App = () => (
      <QueryClientProvider client={queryClient}>
        <RestOfApp />
      </QueryClientProvider>
    );
    ```

3.  **Create Custom Hooks**:
    ```typescript
    // hooks/useProducts.ts
    import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
    import axios from 'axios';

    export const useProducts = () => {
      const queryClient = useQueryClient();

      const query = useQuery({
        queryKey: ['products'],
        queryFn: () => axios.get('/api/products').then(res => res.data),
      });

      const addMutation = useMutation({
        mutationFn: (newProduct) => axios.post('/api/products', newProduct),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
        },
      });

      return { ...query, addProduct: addMutation.mutate };
    };
    ```

4.  **Use in Component**:
    ```typescript
    const ProductList = () => {
      const { data: products, isLoading, addProduct } = useProducts();

      if (isLoading) return <div>Loading...</div>;

      return (
        <ul>
          {products.map(p => <li key={p.id}>{p.name}</li>)}
          <button onClick={() => addProduct({ name: 'New Phone' })}>Add</button>
        </ul>
      );
    };
    ```

---

## 3. How to Create a New CRUD Module

Follow these steps to add a new resource (e.g., "Categories").

### Step 1: Define Type
Add the interface to `types.ts`.
```typescript
export interface Category {
  id: string;
  name: string;
}
```

### Step 2: Update Mock Server (Backend)
Add the model and routes to `services/mockServer.ts`.
```typescript
// services/mockServer.ts
models: {
  category: Model.extend<Partial<Category>>({}),
},
routes() {
  this.get('/categories', (schema) => schema.all('category').models.map(m => m.attrs));
  this.post('/categories', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);
    return schema.create('category', attrs).attrs;
  });
  // ... implement PUT, DELETE
}
```

### Step 3: Update API Service
Add methods to `services/api.ts`.
```typescript
export const api = {
  // ...
  categories: {
    getAll: () => fetchClient<Category[]>('/categories'),
    create: (cat: Category) => fetchClient<Category>('/categories', { data: cat }),
  }
};
```

### Step 4: Update State Management (Store)
Modify `services/storeContext.tsx` to handle the new resource.
```typescript
// Add state
const [categories, setCategories] = useState<Category[]>([]);

// Fetch in refreshData
const [catData] = await Promise.all([api.categories.getAll()]);
setCategories(catData);

// Add Action
const addCategory = async (cat: Category) => {
  const newCat = await api.categories.create(cat);
  setCategories(prev => [...prev, newCat]);
};
```

### Step 5: Create UI Components
Create `CategoryList.tsx` and `CategoryForm.tsx` in `pages/admin/`.
- Use `useStore()` to get data and actions.
- Call `addCategory` inside a `try/catch` block with `await`.
- Use local state for form inputs.

---

## 4. Authentication

The project uses a simple token-based authentication mock.
- `api/login` returns a token.
- `fetchClient` automatically attaches `Authorization: Bearer <token>` if found in localStorage.
- To implement real auth, replace the mock endpoint with your backend URL.
