
import { useState } from "react";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  Shield,
  Users,
  Flag,
  User,
  Ban,
  FileText,
  Search,
  ChevronDown,
  MoreHorizontal,
  Check,
  X,
  AlertTriangle,
  BadgeAlert,
  Edit,
  Trash,
  ExternalLink,
  BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

// Mock data for users
const mockUsers = [
  { id: "1", username: "FlameThrow3r", email: "flame@example.com", status: "active", joinDate: "2025-01-15", battles: 59, reports: 0 },
  { id: "2", username: "RoastMaster99", email: "roast@example.com", status: "active", joinDate: "2025-01-20", battles: 38, reports: 2 },
  { id: "3", username: "WittyComeback", email: "witty@example.com", status: "active", joinDate: "2025-02-05", battles: 41, reports: 1 },
  { id: "4", username: "BurnNotice", email: "burn@example.com", status: "inactive", joinDate: "2025-01-10", battles: 32, reports: 0 },
  { id: "5", username: "SavageModeOn", email: "savage@example.com", status: "banned", joinDate: "2025-02-12", battles: 29, reports: 7 },
];

// Mock data for reported content
const mockReports = [
  { 
    id: "r1", 
    type: "comment", 
    content: "Extremely offensive personal attack against user's appearance", 
    reportedBy: "BurnNotice", 
    reportedUser: "SavageModeOn", 
    date: "2025-03-10", 
    status: "pending", 
    severity: "high" 
  },
  { 
    id: "r2", 
    type: "roast", 
    content: "Inappropriate racial language in roast battle", 
    reportedBy: "FlameThrow3r", 
    reportedUser: "RoastMaster99", 
    date: "2025-03-08", 
    status: "pending", 
    severity: "high" 
  },
  { 
    id: "r3", 
    type: "message", 
    content: "Threatening message sent via private chat", 
    reportedBy: "WittyComeback", 
    reportedUser: "SavageModeOn", 
    date: "2025-03-05", 
    status: "resolved", 
    severity: "medium" 
  },
];

// Mock statistics data
const mockStats = {
  totalUsers: 2487,
  activeUsers: {
    day: 358,
    week: 1245,
    month: 1892
  },
  totalBattles: 3642,
  reportResolutionRate: 87,
  userGrowth: [25, 30, 45, 60, 42, 50, 68, 75, 80, 95, 110, 125],
  battleActivity: [120, 145, 165, 198, 210, 230, 240, 270, 310, 330, 360, 390]
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleBanUser = (userId: string, username: string) => {
    toast.success("User status updated", {
      description: `${username} has been banned from the platform.`
    });
  };
  
  const handleResolveReport = (reportId: string) => {
    toast.success("Report resolved", {
      description: "The report has been marked as resolved."
    });
  };
  
  const handleDeleteUser = (userId: string, username: string) => {
    toast.success("User deleted", {
      description: `${username}'s account has been deleted.`
    });
  };

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-night flex flex-col">
      
      
      
      <main className="container flex-1 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Admin Sidebar */}
          <aside className="lg:w-64">
            <Card className=" border-night-700 bg-night-800">
              <CardHeader className="px-4 py-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Shield className="h-5 w-5" />
                  <CardTitle className="text-lg">Admin Panel</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === "users" ? "bg-flame-600/20 text-flame-500" : ""}`}
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === "reports" ? "bg-flame-600/20 text-flame-500" : ""}`}
                    onClick={() => setActiveTab("reports")}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Reports
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === "analytics" ? "bg-flame-600/20 text-flame-500" : ""}`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
            <TabsContent value="users" className={activeTab === "users" ? "block" : "hidden"}>
              <Card className=" border-night-700">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-9 border-night-700 bg-night-800 focus-visible:ring-flame-500"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-night-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-night-800">
                          <tr>
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Battles</th>
                            <th className="px-4 py-3 text-center">Reports</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-night-700">
                          {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-night-900/50 hover:bg-night-800">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 border border-night-700">
                                    <AvatarFallback className="bg-night-700 text-flame-500 text-xs">
                                      {user.username.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-xs text-muted-foreground">
                                      Joined {new Date(user.joinDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                              <td className="px-4 py-3 text-center">
                                <Badge
                                  variant={user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "destructive"}
                                  className="capitalize"
                                >
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-center font-mono">{user.battles}</td>
                              <td className="px-4 py-3 text-center">
                                {user.reports > 0 ? (
                                  <Badge variant="destructive" className="font-mono">
                                    {user.reports}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground font-mono">0</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-night-800 border-night-700">
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                      <User className="h-4 w-4" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                      <Edit className="h-4 w-4" />
                                      Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-night-700" />
                                    <DropdownMenuItem 
                                      className="flex items-center gap-2 cursor-pointer text-amber-500 focus:text-amber-500" 
                                      onClick={() => handleBanUser(user.id, user.username)}
                                    >
                                      <Ban className="h-4 w-4" />
                                      {user.status === "banned" ? "Unban User" : "Ban User"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                      onClick={() => handleDeleteUser(user.id, user.username)}
                                    >
                                      <Trash className="h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex items-center justify-between px-4 py-3 bg-night-800 border-t border-night-700">
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredUsers.length} of {mockUsers.length} users
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-night-700">
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" className="border-night-700">
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className={activeTab === "reports" ? "block" : "hidden"}>
              <Card className=" border-night-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Reported Content
                  </CardTitle>
                  <CardDescription>
                    Review and moderate flagged content across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReports.map(report => (
                      <Card key={report.id} className={`border-night-700 bg-night-800 ${report.status === "resolved" ? "opacity-70" : ""}`}>
                        <CardHeader className="px-4 py-3 flex flex-row items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Badge variant={report.severity === "high" ? "destructive" : "secondary"} className="capitalize">
                                {report.severity}
                              </Badge>
                              <span>{report.type}</span>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Reported {new Date(report.date).toLocaleDateString()} by {report.reportedBy}
                            </CardDescription>
                          </div>
                          <Badge variant={report.status === "resolved" ? "default" : "outline"} className="capitalize">
                            {report.status}
                          </Badge>
                        </CardHeader>
                        <CardContent className="px-4 py-3 border-t border-night-700">
                          <div className="text-sm">
                            <div className="mb-3">
                              <div className="text-muted-foreground text-xs mb-1">Reported Content:</div>
                              <div className="bg-night-900 rounded-md p-3 border border-night-700">
                                {report.content}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-muted-foreground text-xs mb-1">Reported User:</div>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 border border-night-700">
                                  <AvatarFallback className="bg-night-700 text-flame-500 text-xs">
                                    {report.reportedUser.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{report.reportedUser}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <div className="px-4 py-3 border-t border-night-700 flex justify-end gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-flame-500 border-night-700"
                            onClick={() => handleBanUser(report.reportedUser, report.reportedUser)}
                          >
                            <Ban className="mr-1 h-3 w-3" />
                            Ban User
                          </Button>
                          {report.status === "pending" ? (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleResolveReport(report.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Resolve
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="border-night-700">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className={activeTab === "analytics" ? "block" : "hidden"}>
              <Card className=" border-night-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    User Analytics
                  </CardTitle>
                  <CardDescription>
                    Track platform growth and user engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-night-800 border-night-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-flame-600/20 text-flame-500 flex items-center justify-center">
                            <Users className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total Users</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-night-800 border-night-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-ember-600/20 text-ember-500 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-xl font-bold">{mockStats.totalBattles.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total Battles</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-night-800 border-night-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center">
                            <BadgeAlert className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-xl font-bold">{mockStats.reportResolutionRate}%</div>
                            <div className="text-xs text-muted-foreground">Report Resolution Rate</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-semibold mb-3">Active Users</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-flame-500">{mockStats.activeUsers.day}</div>
                          <div className="text-xs text-muted-foreground">Today</div>
                        </div>
                        <div className="glass-card rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-flame-500">{mockStats.activeUsers.week}</div>
                          <div className="text-xs text-muted-foreground">This Week</div>
                        </div>
                        <div className="glass-card rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-flame-500">{mockStats.activeUsers.month}</div>
                          <div className="text-xs text-muted-foreground">This Month</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-semibold mb-3">User Growth (Last 12 Months)</h3>
                      <div className="glass-card rounded-lg p-4">
                        <div className="h-64 flex items-end justify-around gap-1">
                          {mockStats.userGrowth.map((value, i) => (
                            <div key={i} className="flex-1">
                              <div 
                                className="bg-gradient-to-t from-flame-700 to-flame-500 rounded-t"
                                style={{ height: `${(value / Math.max(...mockStats.userGrowth)) * 80}%` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                          <span>Jul</span>
                          <span>Aug</span>
                          <span>Sep</span>
                          <span>Oct</span>
                          <span>Nov</span>
                          <span>Dec</span>
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-semibold mb-3">Battle Activity (Last 12 Months)</h3>
                      <div className="glass-card rounded-lg p-4">
                        <div className="h-64 flex items-end justify-around gap-1">
                          {mockStats.battleActivity.map((value, i) => (
                            <div key={i} className="flex-1">
                              <div 
                                className="bg-gradient-to-t from-ember-700 to-ember-500 rounded-t"
                                style={{ height: `${(value / Math.max(...mockStats.battleActivity)) * 80}%` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                          <span>Jul</span>
                          <span>Aug</span>
                          <span>Sep</span>
                          <span>Oct</span>
                          <span>Nov</span>
                          <span>Dec</span>
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
