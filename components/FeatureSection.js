import Container from '@/components/container';

/**
 * Feature Section Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.background - Background color style
 * @param {boolean} props.centered - Whether content should be centered
 */
export default function FeatureSection({
  title,
  description,
  children,
  background = 'light',
  centered = false,
}) {
  // Background variants
  const backgroundStyles = {
    light: 'bg-background',
    dark: 'bg-primary text-black',
    primary: 'bg-primary text-primary-foreground',
    gradient: 'bg-gradient-to-br from-primary to-secondary',
    darkGradient: 'bg-gray-200 dark:bg-black',
  };

  // Title text color based on background
  const titleStyles = {
    light: 'text-foreground',
    dark: 'text-primary-foreground',
    primary: 'text-primary-foreground',
    gradient: 'text-primary-foreground',
    darkGradient: 'text-foreground',
  };

  // Description text color based on background
  const descriptionStyles = {
    light: 'text-foreground',
    dark: 'text-primary-foreground',
    primary: 'text-primary-foreground/80',
    gradient: 'text-primary-foreground/80',
    darkGradient: 'text-foreground/80',
  };

  return (
    <section className={`py-16 md:py-24 ${backgroundStyles[background]} `}>
      <Container>
        <div className={`max-w-4xl ${centered ? 'mx-auto text-center' : ''} mb-12 md:mb-16`}>
          {title && (
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleStyles[background]}`}>
              {title}
            </h2>
          )}

          {description && (
            <p className={`text-lg ${descriptionStyles[background]}`}>
              {description}
            </p>
          )}
        </div>

        {children}
      </Container>
    </section>
  );
}
