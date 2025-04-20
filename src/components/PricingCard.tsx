
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardWrapperProps {
  title: string;
  price: string;
  description: string;
  features: { name: string; included: boolean }[];
  buttonText: string;
  isPopular?: boolean;
  onSubscribe: () => void;
  currentPlan?: boolean;
}

export const PricingCardWrapper: React.FC<PricingCardWrapperProps> = ({
  title,
  price,
  description,
  features,
  buttonText,
  isPopular = false,
  onSubscribe,
  currentPlan = false,
}) => {
  return (
    <div className="relative group">
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-6 py-1.5 bg-[#F8C537] text-black text-sm font-bold rounded-full z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black transform -rotate-[4deg] transition-transform group-hover:rotate-0">
          Most Popular
        </div>
      )}
      <Card 
        className={`
          relative transform transition-all duration-200 
          hover:-translate-y-1 hover:translate-x-1
          ${isPopular ? 'bg-[#C5B4F0]' : 'bg-[#FFB4A8]'} 
          border-2 border-black rounded-xl overflow-hidden
          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
          ${isPopular ? 'rotate-1 hover:rotate-0' : ''}
          ${currentPlan ? 'ring-4 ring-[#F8C537]' : ''}
        `}
      >
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="text-2xl font-black text-black">{title}</CardTitle>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tight text-black">{price}</span>
            {price !== 'Free' && (
              <span className="text-lg font-bold text-black/70">/mo</span>
            )}
          </div>
          <CardDescription className="font-medium text-black/70">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li 
                key={index} 
                className={`
                  flex items-start gap-3 
                  ${feature.included ? 'opacity-100' : 'opacity-50'}
                `}
              >
                <CheckCircle2 
                  className={`
                    h-5 w-5 flex-shrink-0
                    ${feature.included ? 'text-black' : 'text-black/40'}
                  `} 
                />
                <span className="font-medium text-black">{feature.name}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            onClick={onSubscribe}
            className={`
              w-full h-12 text-lg font-bold transition-all duration-200
              border-2 border-black rounded-lg
              transform hover:-translate-y-1 hover:translate-x-1
              ${isPopular 
                ? 'bg-[#F8C537] text-black hover:bg-[#F8C537]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-[#A6C7F7] text-black hover:bg-[#A6C7F7]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              }
              ${currentPlan ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            `}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PricingCardWrapper;
