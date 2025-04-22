
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccountSettings } from "@/components/SettingsSections";

const AccountSettingsCard: React.FC = () => {
  return (
    <Card className="border-night-700">
      <CardHeader>
        <CardTitle className="text-xl">
          Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AccountSettings />
      </CardContent>
    </Card>
  );
};

export default AccountSettingsCard;
