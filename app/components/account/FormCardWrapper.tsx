import {ReactNode} from 'react';

type Props = {
  children?: ReactNode;
  title: string;
};

export default function FormCardWrapper({children, title}: Props) {
  return (
    <div className="mx-auto max-w-lg pt-24">
      <h1 className="mb-12 text-center">{title}</h1>
      {children}
    </div>
  );
}
