import PackGroupImage from "../assets/images/experiencie/packgroup.JPG";
import FiebreFutboleraImage from "../assets/images/experiencie/fiebrefutbolera.JPG";

export const experienceData = [
  {
    id: 2,
    date: "Octubre 2025",
    title: "Fiebre Futbolera – E-commerce fotográfico",
    company: "Fiebre Futbolera",
    description:
      "Desarrollo desde cero de tienda online para venta de fotografías deportivas infantiles. Implementación completa: catálogo de productos, carrito, checkout y pasarela de pago con WooCommerce. Diseño responsive y optimización de la experiencia de compra.",
    image: FiebreFutboleraImage,
    link: "https://fiebrefutbolera.com/",
    details: [
      { label: "Industria", value: "Fotografía Deportiva" },
      { label: "Tipo de sitio", value: "E-commerce" },
      { label: "Modalidad", value: "Proyecto freelance" },
      { label: "Rol", value: "Desarrollador Full Stack" },
    ],
  },
  {
    id: 1,
    date: "Febrero 2026",
    title: "Packgroup - Optimización SEO integral ",
    company: "PackGroup",
    description:
      "Optimización SEO integral que logró un aumento del 40% en visitas orgánicas. Mejoras en meta tags, estructura de encabezados, velocidad de carga y contenido optimizado para keywords del sector industrial.",
    image: PackGroupImage,
    link: "https://www.packgroup.com.ar/",
    details: [
      { label: "Industria", value: "Envases y packaging de cartón" },
      { label: "Tipo de sitio", value: "Web corporativa / industrial" },
      { label: "Rol", value: "SEO técnico & on-page" },
      { label: "Modalidad", value: "Proyecto freelance" },
    ],
  },
];
