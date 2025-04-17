import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/allProducts`,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      providesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => 
        error ? [] : [
          { type: 'Product', id: productId },
          'Products'
        ],
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          console.log('Review submitted successfully:', response);
          
          // If we got updated product data in the response, we could update the cache directly
          if (response?.product) {
            console.log('Received updated product data with new review');
          }
        } catch (err) {
          console.error('Failed to create review:', err);
        }
      },
    }),

    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio, keyword, category, ratings }) => {
        // For logging/debugging
        console.log('Sending filter request with:', { checked, radio, keyword, category, ratings });
        
        // Build query parameters object
        const params = {};
        
        // Add parameters only if they exist and have values
        if (checked && checked.length) params.checked = JSON.stringify(checked);
        if (radio && radio.length) params.radio = JSON.stringify(radio);
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (ratings) params.ratings = ratings;
        
        return {
          url: `${PRODUCT_URL}/filter`,
          params,
          method: "POST",
          body: { checked, radio, keyword, category, ratings }
        };
      },
      // Enable cache invalidation when products change
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;
