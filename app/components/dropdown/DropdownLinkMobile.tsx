import {useState} from 'react';
import {NavigationDropdown} from './navigationDropdown';

type Props = {
  dropdownItem: NavigationDropdown;
};

export default function DropdownLinkMobile({dropdownItem}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button className="relative" onClick={() => setIsOpen(!isOpen)}>
      <div className="">
        <div className="flex cursor-pointer items-center hover:underline">
          {dropdownItem.title}
          <svg
            className="ml-1"
            height="5px"
            width="7px"
            aria-hidden="true"
            viewBox="0 0 7 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0L3.49216 3.49095L7 0H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className={`${isOpen ? 'h-auto' : 'h-0'} overflow-hidden`}>
        <div className="scroll-inverse ml-4 mt-6 flex flex-col gap-6 transition-all">
          {dropdownItem.children?.map((item) => (
            <a
              href={`/collections/${item.url}`}
              className="w-auto cursor-pointer whitespace-nowrap hover:underline"
              key={item.title}
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </button>
  );
}
