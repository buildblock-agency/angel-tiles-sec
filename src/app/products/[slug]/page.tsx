import { notFound } from 'next/navigation';
import ProductClient from '@/components/ProductClient';
import { getProductBySlug, getRelatedProducts, PRODUCTS } from '@/content/products';

// Static generation of all product detail pages
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
  };
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  // Generate structured JSON-LD product data for Google Search crawling
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `https://angeltilesandstone.com${product.image}`,
    "description": product.description,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "priceValuation": product.priceRange,
      "priceRange": product.priceRange,
      "areaServed": "Jodhpur, Rajasthan, India"
    },
    "additionalProperty": Object.entries(product.spec).map(([key, val]) => ({
      "@type": "PropertyValue",
      "name": key,
      "value": Array.isArray(val) ? val.join(', ') : val
    }))
  };

  return (
    <>
      {/* Inject JSON-LD Schema on Page Load */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={product} relatedProducts={related} />
    </>
  );
}
