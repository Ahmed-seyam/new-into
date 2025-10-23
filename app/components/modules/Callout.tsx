import clsx from 'clsx';
import type {SanityColorTheme, SanityModuleCallout} from '../../types';
import LinkButton from '../elements/LinkButton';

type Props = {
  colorTheme?: SanityColorTheme;
  module: SanityModuleCallout;
};

export default function CalloutModule({colorTheme, module}: Props) {
  return (
    <div
      className="ml-3 mr-auto mt-1.5 flex flex-col items-start md:ml-5"
      style={{color: colorTheme?.text}}
    >
      {/* Text */}
      <div className={clsx('text-xl', 'md:text-4xl')}>{module.text}</div>

      {/* Link */}
      {module.link && (
        <div className="mt-4">
          <LinkButton backgroundColor={colorTheme?.text} link={module.link} />
        </div>
      )}
    </div>
  );
}
