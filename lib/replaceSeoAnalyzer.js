import parse from 'html-react-parser';
import SeoCheckForm from '@/components/seoCheckForm';
import Image from 'next/image';

export const replaceSeoAnalyzer = (htmlContent) => {
  return parse(htmlContent, {
    replace: ({ attribs, name }) => {
      if (name === 'div' && attribs && attribs.id === 'seo-page-analyzer') {
        return <SeoCheckForm />;
      }
      if (name === 'img' && attribs) {
        const { src, alt, width, height } = attribs;
        return <Image src={src} alt={alt} width={width} height={height} />;
      }
    },
  });
};