"use client";
import { useReducer } from "react";
import Card from "./Card";
import Link from "next/link"

const venues = [
  { name: "The Bloom Pavilion", img: "/img/bloom.jpg" },
  { name: "Spark Space", img: "/img/sparkspace.jpg" },
  { name: "The Grand Table", img: "/img/grandtable.jpg" },
];

type Action =
  | { type: "set"; venue: string; rating: number }
  | { type: "remove"; venue: string };

function ratingReducer(state: Map<string, number>, action: Action) {
  const newState = new Map(state);
  if (action.type === "set") {
    newState.set(action.venue, action.rating);
  } else if (action.type === "remove") {
    newState.delete(action.venue);
  }
  return newState;
}

export default function CardPanel() {
  const [ratings, dispatch] = useReducer(
    ratingReducer,
    new Map(venues.map((v) => [v.name, 0]))
  );

// Mock

const mockVenueRepo = [
  {vid: "001", name: "The Bloom Pavilion", image: "/img/bloom.jpg"},
  {vid: "002", name: "Spark Space", image: "/img/sparkspace.jpg"},
  {vid: "003", name: "The Grand Table", image: "/img/grandtable.jpg"},
];

  return (
    <div>
      <div
        style={{
          margin: "20px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignContent: "space-around",
          gap: "24px",
        }}
      >
        {mockVenueRepo.map((v) => (
          <Link href={`/venue/${v.vid}`}>
          <Card
            key={v.name}
            venueName={v.name}
            imgSrc={v.image}
            rating={ratings.get(v.name) ?? 0}
            onRatingChange={(r) =>
              dispatch({ type: "set", venue: v.name, rating: r })
            }
          />
          </Link>
        ))}
      </div>
      <div className="mt-8">
        {[...ratings.entries()].map(([venue, rating]) => (
          <div
            key={venue}
            data-testid={venue}
            className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded text-blue-900"
            onClick={() => dispatch({ type: "remove", venue })}
          >
            {venue} Rating : {rating}
          </div>
        ))}
      </div>
    </div>
  );
}
