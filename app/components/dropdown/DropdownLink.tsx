import {useState} from 'react';
import {NavigationDropdown} from './navigationDropdown';

type Props = {
  dropdownItem: NavigationDropdown;
};

export default function DropdownLink({dropdownItem}: Props) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownVisible(true)}
      onMouseLeave={() => setIsDropdownVisible(false)}
    >
      <div className="">
        <div className="flex cursor-default items-center">
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
              fill="black"
            />
          </svg>
        </div>
      </div>
      {isDropdownVisible && (
        <div className="absolute pt-2">
          <div className="shadow-lg overflow-hidden rounded-sm ring-1 ring-black ring-opacity-5">
            <div className="scroll-inverse flex max-h-[249px] flex-col gap-1 overflow-y-auto overscroll-contain bg-gray p-2 ">
              {dropdownItem.children?.map((item) => (
                <a
                  href={`/collections/${item.url}`}
                  className="mr-0.5 w-auto cursor-pointer whitespace-nowrap hover:text-theme"
                  key={item.title}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
