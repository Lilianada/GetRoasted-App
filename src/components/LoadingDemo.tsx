
import React from 'react';
import { Loader } from '@/components/ui/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoadingDemo = () => {
  const colors = [
    { bg: '#F8C537', name: 'Gold' },         // Gold from image
    { bg: '#C5B4F0', name: 'Lavender' },     // Lavender from image
    { bg: '#A6C7F7', name: 'Light Blue' },   // Light blue from image
    { bg: '#FF719A', name: 'Pink' },         // Pink from image
    { bg: '#FF6B35', name: 'Flame Orange' }, // From your theme
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Loading Animations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Default Loaders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-4">
              <span className="w-24">Small:</span>
              <Loader size="small" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24">Medium:</span>
              <Loader size="medium" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24">Large:</span>
              <Loader size="large" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Colorful Loaders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-4">
              <span className="w-24">Small:</span>
              <Loader size="small" variant="colorful" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24">Medium:</span>
              <Loader size="medium" variant="colorful" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-24">Large:</span>
              <Loader size="large" variant="colorful" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-xl font-bold my-6">Color Examples from Image</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {colors.map((color) => (
          <Card key={color.name} className="overflow-hidden">
            <div 
              className="h-20 w-full" 
              style={{ backgroundColor: color.bg }}
            />
            <CardContent className="p-4">
              <p className="text-sm font-medium">{color.name}</p>
              <p className="text-xs text-muted-foreground">{color.bg}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoadingDemo;
