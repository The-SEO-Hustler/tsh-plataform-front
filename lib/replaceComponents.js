import parse from 'html-react-parser';
import SeoCheckForm from '@/components/seoCheckForm';
import Image from 'next/image';
import AdvancedKeywordForm from '@/components/advancedKeywordForm';
import LLMForm from '@/components/LLMForm';
import ContentPlanningForm from '@/components/contentPlanningForm';
export const replaceComponents = (htmlContent) => {
  return parse(htmlContent, {
    replace: ({ attribs, name }) => {
      if (name === 'div' && attribs && attribs.id === 'seo-page-analyzer') {
        return <SeoCheckForm />;
      }
      if (name === 'img' && attribs) {
        const { src, alt, width, height } = attribs;
        return <Image src={src} alt={alt} width={width} height={height} />;
      }
      if (name === 'div' && attribs && attribs.id === 'advanced-keyword-analysis') {
        return <AdvancedKeywordForm />;
      }
      if (name === 'div' && attribs && attribs.id === 'llm-txt-generator') {
        return <LLMForm />;
      }
      if (name === 'div' && attribs && attribs.id === 'content-planning') {
        return <ContentPlanningForm />;
      }
    },
  });
};