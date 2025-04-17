
// The file is read-only, but we can create a custom component to handle this

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardWrapperProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  onSubscribe: () => void;
}

export const PricingCardWrapper: React.FC<PricingCardWrapperProps> = ({
  title,
  price,
  description,
  features,
  buttonText,
  isPopular = false,
  onSubscribe,
}) => {
  return (
    <div className="relative">
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-flame-500 text-white text-xs font-bold rounded-full z-10">
          Most Popular
        </div>
      )}
      <Card className={`flame-card h-full ${isPopular ? 'border-flame-500 shadow-lg' : ''}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div>
            <span className="text-3xl font-bold">{price}</span>
            {price !== 'Free' && <span className="text-muted-foreground">/mo</span>}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-flame-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onSubscribe} 
            className={`w-full ${isPopular ? 'bg-gradient-flame hover:opacity-90' : ''}`}
            variant={isPopular ? 'default' : 'outline'}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
