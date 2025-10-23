// import { HERO_HOME } from '../heroes/home';
import {MODULES} from '../modules';
import {SEO} from '../seo';

export const HOME_PAGE = `
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;
