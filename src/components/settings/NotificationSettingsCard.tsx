
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";

const NotificationSettingsCard: React.FC = () => {
  return (
    <Card className="border-night-700">
      <CardHeader>
        <CardTitle className="text-xl">
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationSettingsForm />
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsCard;
