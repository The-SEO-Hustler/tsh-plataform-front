import parse from 'html-react-parser';
import SeoCheckForm from '@/components/seoCheckForm';

export const replaceSeoAnalyzer = (htmlContent) => {
  return parse(htmlContent, {
    replace: ({ attribs, name }) => {
      if (name === 'div' && attribs && attribs.id === 'seo-page-analyzer') {
        return <SeoCheckForm />;
      }
    },
  });
};