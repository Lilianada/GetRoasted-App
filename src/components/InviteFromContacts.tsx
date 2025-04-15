
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Users, Mail, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  selected: boolean;
}

interface InviteFromContactsProps {
  battleId: string;
  trigger?: React.ReactNode;
}

const InviteFromContacts = ({ battleId, trigger }: InviteFromContactsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteMessage, setInviteMessage] = useState(
    `Join me for an epic roast battle on GetRoasted! Click the link to join: ${window.location.origin}/battle/${battleId}`
  );
  
  // Mock contacts - would come from API/database in a real app
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Alex Johnson", email: "alex@example.com", selected: false },
    { id: "2", name: "Jamie Smith", email: "jamie@example.com", selected: false },
    { id: "3", name: "Taylor Wong", email: "taylor@example.com", selected: false },
    { id: "4", name: "Morgan Lee", email: "morgan@example.com", selected: false },
    { id: "5", name: "Casey Brown", email: "casey@example.com", selected: false },
  ]);
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle contact selection
  const toggleContact = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, selected: !contact.selected } : contact
    ));
  };
  
  // Selected contacts
  const selectedContacts = contacts.filter(contact => contact.selected);
  
  // Handle invite submission
  const handleInvite = () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }
    
    // In a real app with Supabase, we would send invites through a backend function
    
    toast.success(`Invites sent to ${selectedContacts.length} contacts!`);
    setIsOpen(false);
    
    // Reset selections
    setContacts(contacts.map(contact => ({ ...contact, selected: false })));
    setSearchQuery("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsOpen(true)}
          >
            <Users className="h-4 w-4" />
            <span>Invite Contacts</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-night-800 border-night-700">
        <DialogHeader>
          <DialogTitle>Invite Contacts</DialogTitle>
          <DialogDescription>
            Select contacts to invite to the battle
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-night-700 focus-visible:ring-flame-500"
          />
          
          {selectedContacts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedContacts.map(contact => (
                <div 
                  key={`selected-${contact.id}`}
                  className="flex items-center gap-1 bg-flame-500/20 text-flame-500 px-2 py-1 rounded-full text-xs"
                >
                  <span>{contact.name}</span>
                  <button 
                    className="text-flame-500 hover:text-flame-600 focus:outline-none"
                    onClick={() => toggleContact(contact.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="border border-night-700 rounded-md h-48 overflow-y-auto">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`flex items-center justify-between p-3 hover:bg-night-700 cursor-pointer ${
                    contact.selected ? 'bg-flame-500/10 border-l-2 border-flame-500' : ''
                  }`}
                  onClick={() => toggleContact(contact.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-night-700 h-8 w-8 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-flame-500" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  
                  <input 
                    type="checkbox" 
                    checked={contact.selected}
                    onChange={() => {}} // Handled by the div click
                    className="accent-flame-500 h-4 w-4"
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No contacts found
              </div>
            )}
          </div>
          
          <Textarea
            placeholder="Add a personal message..."
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
            className="border-night-700 focus-visible:ring-flame-500"
            rows={3}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            className="gap-2 bg-gradient-flame hover:opacity-90"
            onClick={handleInvite}
            disabled={selectedContacts.length === 0}
          >
            <Mail className="h-4 w-4" />
            Send Invites ({selectedContacts.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFromContacts;
