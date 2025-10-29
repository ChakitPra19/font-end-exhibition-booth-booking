import Card from "./Card";
import Link from "next/link"

interface VenueItem {
  id: string;
  name: string;
  picture: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  dailyrate: number;
}

interface VenueJson {
  count: number;
  data: VenueItem[];
}

export default function VenueCatalog({venuesJson}: {venuesJson: VenueJson}) {
    return(
        <>
        Explore {venuesJson.count} models in our catalog
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
        {venuesJson.data.map((v:VenueItem) => (
          <Link href={`/venue/${v.id}`} key={v.id}>
          <Card
            venueName={v.name}
            imgSrc={v.picture}
          />
          </Link>
        ))}
      </div>
        </>
    )
}