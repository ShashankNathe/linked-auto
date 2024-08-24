import Link from "next/link";
import { MoreVertical, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getScheduledPosts } from "../actions/databaseActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DashboardChart } from "@/components/DashboardChart";
export default async function Dashboard() {
  const { data } = await getScheduledPosts();

  function startOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday is the first day of the week
    return new Date(d.setDate(diff));
  }

  function startOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  function calculatePercentageChange(current, previous) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  }

  function getMonthName(index) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[index];
  }

  // Time calculations
  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const thisMonthStart = startOfMonth(now);

  const lastWeekStart = startOfWeek(addDays(thisWeekStart, -7));
  const lastMonthStart = startOfMonth(addMonths(thisMonthStart, -1));

  // Filter posts based on timeframes
  const postsThisWeek = data.filter((post) => {
    const publishedAt = new Date(post.published_at);
    return publishedAt >= thisWeekStart && publishedAt < now;
  });

  const postsLastWeek = data.filter((post) => {
    const publishedAt = new Date(post.published_at);
    return publishedAt >= lastWeekStart && publishedAt < thisWeekStart;
  });

  const postsThisMonth = data.filter((post) => {
    const publishedAt = new Date(post.published_at);
    return publishedAt >= thisMonthStart && publishedAt < now;
  });

  const postsLastMonth = data.filter((post) => {
    const publishedAt = new Date(post.published_at);
    return publishedAt >= lastMonthStart && publishedAt < thisMonthStart;
  });

  // Calculate percentage changes
  const weekChange = calculatePercentageChange(postsThisWeek.length, postsLastWeek.length);
  const monthChange = calculatePercentageChange(postsThisMonth.length, postsLastMonth.length);

  // Generate chart data for the last 6 months
  const currentMonthIndex = now.getMonth();
  const startMonthIndex = (currentMonthIndex - 5 + 12) % 12;
  const startYear = now.getFullYear() - (currentMonthIndex < 5 ? 1 : 0);

  const chartData = Array.from({ length: 6 }, (_, index) => {
    const monthIndex = (startMonthIndex + index) % 12;
    const yearOffset = Math.floor((startMonthIndex + index) / 12);
    const year = startYear + yearOffset;

    return {
      month: `${getMonthName(monthIndex)} ${year}`,
      desktop: 0,
    };
  });

  // Populate chart data
  data.forEach((post) => {
    const publishedAt = new Date(post.published_at);
    const postMonthIndex = publishedAt.getMonth();
    const postYear = publishedAt.getFullYear();

    chartData.forEach((data, index) => {
      const [monthName, year] = data.month.split(" ");
      if (getMonthName(postMonthIndex) === monthName && postYear.toString() === year) {
        chartData[index].desktop += 1;
      }
    });
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Welcome</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful Analysis.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">
                {postsThisWeek.length} <span className="text-base text-muted-foreground">post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{weekChange}% from last week</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">
                {postsThisMonth.length} <span className="text-base text-muted-foreground">post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{monthChange}% from last month</div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="week">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard/schedule">
                    <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Schedule post</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="sm:hidden" side="top">
                  Schedule post
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <TabsContent value="week">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Scheduled posts</CardTitle>
                <CardDescription>Manage and track your posts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead className="hidden sm:table-cell">Scheduled Time</TableHead>
                      <TableHead className="">Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((d) => {
                      return (
                        <TableRow className="" key={d._id}>
                          <TableCell>
                            {d.content && <div className="font-medium">{d.content && d.content.length < 50 ? d.content : d.content.substring(0, 50) + "..."}</div>}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{new Date(d.scheduleDate).toLocaleString()}</TableCell>
                          <TableCell className="">
                            <Badge
                              className={`text-xs ${d.status == "scheduled" ? "" : d.status == "published" ? "bg-green-600 hover:bg-green-600" : ""}`}
                              variant={d.status == "paused" ? "destructive" : "secondary"}
                            >
                              {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="outline" className="h-8 w-8">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Link href={`/dashboard/post/${d._id}`}>View</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">Activity</CardTitle>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <CardDescription>{new Date().toDateString()}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 py-10 text-sm">
            <DashboardChart chartData={chartData} />
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="leading-none text-muted-foreground">Showing total posts for the last 6 months</div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
