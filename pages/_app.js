import "@/styles/globals.css";
import {ProductProvider} from "@/components/ProductContext.js";
import '../styles/index.css'

export default function App({ Component, pageProps }) {
  return (
      <ProductProvider>
        <Component {...pageProps} />;
      </ProductProvider>
  );
}
