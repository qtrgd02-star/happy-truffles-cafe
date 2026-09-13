import { Metadata } from "next";
import { menuItems } from "@/app/menu-data";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = Number(params.id);
  const item = menuItems.find((p) => p.id === id);

  if (!item) {
    return {
      title: "Product Not Found | Happy Truffles Cafe",
    };
  }

  return {
    title: `${item.title} | Happy Truffles Cafe`,
    description: item.description,
  };
}