
import { Button } from '@/components/ui/button';
import Container from '@/components/container';
import HeroTemplate from '@/components/HeroTemplate';
export default function Hero() {


  return (
    <HeroTemplate>


      {/* Yellow accent shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full opacity-10 translate-y-1/2 -translate-x-1/3"></div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className=" text-4xl md:text-5xl lg:text-6xl font-black dark:text-foreground text-white mb-6 leading-tight">
            <span className="text-primary">DIY SEO</span> for the Go-Getters
          </h1>
          <p className=" animation-delay-1 text-xl md:text-2xl dark:text-foreground/80 text-white/80 mb-8 max-w-3xl mx-auto intro-paragraph">
            Free tools, in-depth playbooks, and resources to help you learn and execute SEO and organic growth by yourself. No fluff, just results.
          </p>
          <div className=" animation-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/free-tools"
              // variant="filled"
              size="lg"
              className="font-bold cursor-pointer"
            >
              Explore Free Tools
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/resources"
              className="font-bold cursor-pointer !border-white"
            >
              Browse Resources
            </Button>
          </div>

          {/* Featured badges */}
          <div className="mt-12 pt-8  flex flex-wrap justify-center  gap-2 md:gap-6 items-center">
            <p className="text-sm font-medium dark:text-foreground/60 text-white/60 w-full sm:w-auto">TRUSTED BY SEO PROFESSIONALS</p>
            {['20K+ USERS', 'DAILY UPDATED', '100+ FREE TOOLS', 'NO BS APPROACH'].map((badge) => (
              <div key={badge} className="px-4 py-1.5 bg-white/5 dark:bg-foreground/5 border border-white/10 dark:border-foreground/10 rounded-full">
                <span className="text-xs font-medium text-white/80 dark:text-foreground/80">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </HeroTemplate>
  );
}
