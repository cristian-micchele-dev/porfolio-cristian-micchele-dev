import PackGroupImage from "../assets/images/experiencie/packgroup.JPG";
import FiebreFutboleraImage from "../assets/images/experiencie/fiebrefutbolera.JPG";

export const experienceData = [
  {
    id: 2,
    date: "Octubre 2025",
    title: "Fiebre Futbolera – E-commerce fotográfico",
    company: "Fiebre Futbolera",
    description:
      "Desarrollo de tienda online para venta de fotografías deportivas infantiles. Implementación de catálogo, carrito y checkout con WooCommerce, optimización visual y experiencia de compra responsive.",
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
      "Se realizo la optimización SEO integral del sitio web de PackGroup, mejorando su posicionamiento en motores de búsqueda y aumentando así su visibilidad online.",
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
