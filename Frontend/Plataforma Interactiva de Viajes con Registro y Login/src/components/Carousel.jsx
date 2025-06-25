import React from "react";

const images = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "París, Francia",
    caption: "París, Francia"
  },
  {
    src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
    alt: "Berlin, Alemania",
    caption: "Berlín, Alemania"
  },
  {
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    alt: "Tokio, Japón",
    caption: "Tokio, Japón"
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?",
    alt: "Roma, Italia",
    caption: "Roma, Italia"
  },
  {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    alt: "Buenos Aires, Argentina",
    caption: "Buenos Aires, Argentina"
  }
];

function Carousel() {
  return (
    <div id="travelCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
      <div className="carousel-inner rounded shadow">
        {images.map((img, idx) => (
          <div className={`carousel-item${idx === 0 ? " active" : ""}`} key={img.src}>
            <img src={img.src} className="d-block w-100" alt={img.alt} style={{maxHeight: 400, objectFit: 'cover'}} />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
              <h5>{img.caption}</h5>
            </div>
          </div>
        ))}
      </div>
      {/* Botón anterior */}
      <button className="carousel-control-prev" type="button" data-bs-target="#travelCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      {/* Botón siguiente */}
      <button className="carousel-control-next" type="button" data-bs-target="#travelCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}

export default Carousel;
// Fin del componente Carrusel
