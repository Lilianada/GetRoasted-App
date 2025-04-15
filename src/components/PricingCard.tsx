
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
  onButtonClick: () => void;
  currentPlan?: boolean;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  popular = false,
  onButtonClick,
  currentPlan = false,
}: PricingCardProps) => {
  return (
    <Card className={`flame-card relative border-night-700 h-full flex flex-col ${
      popular ? 'border-flame-500/50 shadow-lg shadow-flame-500/10' : ''
    }`}>
      {popular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="bg-flame-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-muted-foreground ml-1">/month</span>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className={`mr-2 mt-1 ${feature.included ? 'text-flame-500' : 'text-muted-foreground'}`}>
                <Check className="h-4 w-4" />
              </div>
              <span className={`text-sm ${!feature.included ? 'text-muted-foreground line-through' : ''}`}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onButtonClick}
          className={`w-full ${
            currentPlan 
              ? 'bg-night-700 hover:bg-night-600' 
              : popular ? 'bg-gradient-flame hover:opacity-90' : 'bg-night-700 hover:bg-night-600'
          }`}
          disabled={currentPlan}
        >
          {currentPlan ? 'Current Plan' : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
