import styles from "./card.module.css"
import Image from "next/image"
import InteractiveCard from "./InteractiveCard"
import Rating from "@mui/material/Rating"

type CardProps = {
    venueName: string,
    imgSrc: string,
    rating?: number,
    onRatingChange?: (value: number) => void
}

export default function Card( { venueName, imgSrc, rating, onRatingChange } : CardProps ){
    return (
        <InteractiveCard contentName={ venueName }>
            <div className="w-full h-[60%] relative">
                <Image src={ imgSrc } 
                alt="Event Picture"
                fill={true}
                objectFit='cover'
                />
            </div>
            {/* <div className={styles.cardtext}>
                <div style={{color:"blue", fontSize: "16px"}}>The Bloom Pavilion</div>
                <div style={{color:"black", fontSize: "12px", paddingTop: "10"}}>Modern Event Space in City Center</div>
            </div> */}
            <div className="h-[20%] p-2.5 gap-[20px] text-blue-900">{venueName}</div>
            {typeof rating === "number" && onRatingChange && (
                <div onClick={e => e.stopPropagation()}>
                    <Rating
                        id={`${venueName} Rating`}
                        name={`${venueName} Rating`}
                        data-testid={`${venueName} Rating`}
                        value={rating}
                        onChange={(_, value) => onRatingChange(value ?? 0)}
                    />
                </div>
            )}
        </InteractiveCard>
    )
}