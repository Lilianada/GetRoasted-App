
import React from 'react';
import { Card } from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'battle' | 'win' | 'achievement';
  title: string;
  description?: string;
  date: string;
}

interface RecentActivityProps {
  loading: boolean;
  activities: ActivityItem[];
}

const RecentActivity = ({ loading, activities }: RecentActivityProps) => {
  if (loading) {
    return (
      <Card className="p-6 bg-secondary border-2 border-black text-black shadow-neo relative overflow-hidden">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="flex justify-center p-8">
          <Loader size="large" variant="colorful" />
        </div>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="p-6 bg-secondary border-2 border-black text-black shadow-neo relative overflow-hidden">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="text-center p-8 text-night-400">
          No recent activity yet. Join some battles to see your activity here!
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-secondary border-2 border-black text-black shadow-neo relative overflow-hidden">
      <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="p-3 border-2 border-night-700 rounded-lg bg-night-700/10 hover:bg-night-700/20 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-black">{activity.title}</h3>
                {activity.description && (
                  <p className="text-sm text-night-500">{activity.description}</p>
                )}
              </div>
              <div className="text-xs text-night-400">
                {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
