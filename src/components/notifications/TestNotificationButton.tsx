import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotificationActions } from '@/hooks/useNotificationActions';

// This component triggers a test notification for development/testing purposes
const TestNotificationButton = () => {
  const { addNotification } = useNotificationActions();

  const handleTest = () => {
    addNotification({
      id: Date.now().toString(),
      title: 'Test Notification',
      message: 'This is a test notification!',
      read: false,
      created_at: new Date().toISOString(),
    });
  };

  return (
    <Button onClick={handleTest} className="mt-2 ml-2 bg-blue-600 hover:bg-blue-700 text-white">
      Send Test Notification
    </Button>
  );
};

export default TestNotificationButton;
