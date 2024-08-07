import Link from "next/link";
import NcImage from "../Image/Image";
import { SearchResultEvent, SearchResultUser, SearchResultVenue } from "./DiscoverSearchPage";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";

export const EventItem = ({ item }: { item: SearchResultEvent; }) => (
    <Link href={`/event/${item.id}/?ref=search`} className="item" key={item.id}>
        <div className="imageWrapper">
            <NcImage
                src={item.thumbnail}
                alt="image"
                imageDimension={{
                    height: 60,
                    width: 100,
                }}
                className="max-w-20 object-cover w-full"
            />
        </div>
        <div className="in">
            <div>
                <h4 className="mb-05" dangerouslySetInnerHTML={{
                    __html: item.name,
                }} />
            </div>
        </div>
    </Link>
);

export const VenueItem = ({ item }: { item: SearchResultVenue; }) => (
    <Link prefetch={true} href={`/venue/${item.id}/?ref=search`} className="item" key={item.id}>
        <div className="imageWrapper">
            <NcImage
                src={item.thumbnail}
                alt="image"
                imageDimension={{
                    height: 60,
                    width: 100,
                }}
                className="max-w-20 object-cover w-full"
            />
        </div>
        <div className="in">
            <div>
                <h4 className="mb-05" dangerouslySetInnerHTML={{
                    __html: item.name,
                }} />

                <div className="text-xs text-neutral-500">{item.venue_location}</div>
                <div className="text-xs text-neutral-500">Aprx. {item.distance} miles away</div>
            </div>
        </div>
    </Link>
);

export const UserItem = ({ item }: { item: SearchResultUser; }) => {
    const { type } = item;

    let url = `/profile/${item.id}/?ref=search`;

    if (type === "vehicle") {
        url = `/profile/garage/${item.id}/?ref=search`;
    }

    return (
        <Link prefetch={true} href={url} className="item" key={item.id}>
            <div className="imageWrapper">
                <NcImage
                    src={item.thumbnail || PLACEHOLDER_PFP}
                    alt="image"
                    imageDimension={{
                        height: 60,
                        width: 100,
                    }}
                    className="max-w-24 object-cover w-full"
                />
            </div>
            <div className="in">
                <div>
                    <h4 className="mb-05 text-sm truncate max-w-60">
                        {item.type === "user" ? item.username : `${item.meta.make} ${item.meta.model}`}
                    </h4>
                    {item.type === "vehicle" && (
                        <div className="text-xs text-neutral-500">Owned by @{item.username}</div>
                    )}
                </div>
            </div>
        </Link>
    );
};
