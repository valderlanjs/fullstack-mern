import { useEffect, useState } from "react";
import TreeCard from "./TreeCard";
import api from "../services/api";

const CardsSection = () => {
  const [cards, setCards] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");

  useEffect(() => {
    api.get("/cards").then((res) => {
      if (Array.isArray(res.data.cards)) {
        setCards(res.data.cards);
        setSectionTitle(res.data.sectionTitle || "");
      } else {
        console.warn("Formato inesperado:", res.data);
      }
    });
  }, []);

  return (
    <section className="max-padd-container py-16">
      {sectionTitle && (
        <h2 className="text-3xl font-bold text-center mb-10">{sectionTitle}</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <TreeCard
            key={card.id}
            image={card.image}
            title={card.title}
            subtitle={card.subtitle}
            link={card.link}
          />
        ))}
      </div>
    </section>
  );
};

export default CardsSection;
