import ReactCardFlip from 'react-card-flip';
import {useState} from 'react';
export default function CardFlip({title, front, back}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const onClick = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div className="mx-3 rounded-md">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <button
          onClick={() => onClick}
          className="overflow-hidden rounded-md bg-theme text-white md:bg-gray"
        >
          <div className="flex h-16 items-center justify-between px-4 text-center ">
            <h3 className="flex-1 ">{title}</h3>
          </div>
          <button className="absolute left-1/2 bottom-4 z-10 flex -translate-x-1/2 transform items-center justify-center gap-3 rounded-full  bg-black py-3 px-5 text-xs text-white">
            {/* <span>Shop the look</span> */}
            Shop editorial
          </button>
          {front}
        </button>
        <div className="rounded-md border border-theme bg-white">
          <button
            onClick={onClick}
            className="absolute left-1/2 bottom-4 z-10 flex -translate-x-1/2 transform items-center justify-center gap-3 rounded-full bg-theme py-3 px-5 text-xs text-white"
          >
            {/* <span>Shop the look</span> */}
            View editorial
          </button>
          {back}
          <div className="flex h-16 items-center justify-between px-4 text-center">
            {/* <h3 className="flex-1">{title}</h3> */}
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
}
