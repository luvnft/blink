'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Wallet, Send, ShoppingBag, Users, Plus, Search, ArrowUpRight, ArrowDownRight, Crown, Dog, ChevronLeft, ChevronRight, SortAsc, SortDesc, Bell, Zap, Trophy, PieChart, LineChart, Activity, Sparkles, TrendingUp, ThumbsUp } from 'lucide-react'
import { BlinkCard } from '@/components/blinkboard/blink-card'
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import debounce from 'lodash/debounce'
import { Sidebar } from '@/components/ui/layout/blinkboard/sidebar'
import { Header } from '@/components/ui/layout/blinkboard/header'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'

const initialData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
]

const blinkValueData = [
  { name: 'Week 1', value: 100 },
  { name: 'Week 2', value: 120 },
  { name: 'Week 3', value: 150 },
  { name: 'Week 4', value: 180 },
]

const blinkPerformanceData = [
  { name: 'Likes', value: 400 },
  { name: 'Shares', value: 300 },
  { name: 'Comments', value: 300 },
  { name: 'Views', value: 200 },
]

const SAND_COLORS = ['#F4E0C7', '#E6CCB2', '#D8B79E', '#C9A28A', '#BB8E76']

const BlinkCarousel = ({ any }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blinks.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + blinks.length) % blinks.length)
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {blinks.map((blink) => (
          <div key={blink.id} className="w-full flex-shrink-0">
            <BlinkCard
              id={blink.id}
              name={blink.name}
              description={blink.description}
              image={blink.image}
              createdAt={blink.createdAt.toLocaleDateString()}
              likes={blink.likes}
            />
          </div>
        ))}
      </div>
      <Button className="absolute top-1/2 left-2 transform -translate-y-1/2" onClick={prevSlide}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button className="absolute top-1/2 right-2 transform -translate-y-1/2" onClick={nextSlide}>
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}

export default function Dashboard() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [chartData, setChartData] = useState(initialData)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('6m')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New follower: Barker", read: false },
    { id: 2, message: "Your Blink 'Sparky' is trending!", read: false },
    { id: 3, message: "You've earned 15,000 BARK", read: true },
  ])
  const [blinks, setBlinks] = useState([
    {
      id: "1",
      name: "The Peaky Barkers",
      description: "A fierce and determined Underdog Blink collection",
      image: "https://ucarecdn.com/0e15b9d9-1166-495a-8343-227ad749f004/ace.jpeg?height=100&width=100",
      createdAt: new Date(),
      likes: 42,
      shares: 15,
      comments: 8,
      views: 230
    },
    {
      id: "2",
      name: "Sparky Bros",
      description: "An inspiring Underdog Blink that overcomes all odds",
      image: "https://ucarecdn.com/0e15b9d9-1166-495a-8343-227ad749f004/ace.jpeg?height=100&width=100",
      createdAt: new Date(),
      likes: 37,
      shares: 12,
      comments: 5,
      views: 180
    },
    {
      id: "3",
      name: "Underdogs",
      description: "A victorious Underdog Blink that defies expectations",
      image: "https://ucarecdn.com/0e15b9d9-1166-495a-8343-227ad749f004/ace.jpeg?height=100&width=100",
      createdAt: new Date(),
      likes: 51,
      shares: 20,
      comments: 10,
      views: 300
    },
    {
      id: "4",
      name: "BARK Club Membership",
      description: "Exclusive BARK Membership Blink with premium perks",
      image: "https://ucarecdn.com/0e15b9d9-1166-495a-8343-227ad749f004/ace.jpeg?height=100&width=100",
      createdAt: new Date(),
      likes: 100,
      shares: 45,
      comments: 30,
      views: 500
    },
    {
      id: "5",
      name: "BARK Mascot",
      description: "The official CNFT mascot of The BARK community",
      image: "https://ucarecdn.com/0e15b9d9-1166-495a-8343-227ad749f004/ace.jpeg?height=100&width=100",
      createdAt: new Date(),
      likes: 150,
      shares: 80,
      comments: 50,
      views: 1000
    },
    {
      id: "6",
      name: "BARK Blink",
      description: "A playful, cartoonish dog-themed Blink collection",
      image: "https://ucarecdn.com/0e15b9d9-1166-495a-8343-227ad749f004/ace.jpeg?height=100&width=100",
      createdAt: new Date(),
      likes: 45,
      shares: 18,
      comments: 7,
      views: 250
    }
  ])

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newData = initialData.map(item => ({ ...item, value: Math.floor(Math.random() * 500) }))
      setChartData(newData)
    } catch (err) {
      setError('Failed to fetch data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData, timeRange])

  const handleCreateBlink = useCallback((name: string, description: string) => {
    const newBlink = {
      id: (blinks.length + 1).toString(),
      name,
      description,
      image: "https://ucarecdn.com/0e15b9d9-1166-495a-8343-227ad749f004/ace.jpeg?height=100&width=100",
      createdAt: new Date(),
      likes: 0,
      shares: 0,
      comments: 0,
      views: 0
    }
    setBlinks(prevBlinks => [newBlink, ...prevBlinks])
    toast({
      title: "Blink Created",
      description: `Your new Blink "${newBlink.name}" has been created! Start customizing it now.`,
    })
  }, [blinks.length, toast])

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const filteredBlinks = blinks.filter(blink => 
        blink.name.toLowerCase().includes(term.toLowerCase()) ||
        blink.description.toLowerCase().includes(term.toLowerCase())
      )
      setBlinks(filteredBlinks)
      setCurrentPage(0)
      toast({
        title: "Search Results",
        description: `Found ${filteredBlinks.length} Blinks matching "${term}"`,
      })
    }, 300),
    [blinks, toast]
  )

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }, [debouncedSearch])

  const sortedBlinks = React.useMemo(() => 
    [...blinks].sort((a, b) => 
      sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes
    ),
    [blinks, sortOrder]
  )

  const visibleBlinks = React.useMemo(() => 
    sortedBlinks.slice(currentPage * 3, (currentPage * 3) + 3),
    [sortedBlinks, currentPage]
  )

  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1)
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    )
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">BARK Blink Dashboard</h2>
              <div className="flex items-center space-x-2 md:space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-[#D0BFB4]" />
                      {notifications.some(n => !n.read) && (
                        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" aria-hidden="true"></span>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Notifications</DialogTitle>
                    </DialogHeader>
                    <ul className="space-y-2">
                      {notifications.map(notif => (
                        <li key={notif.id} className={`p-2 rounded ${notif.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-100 dark:bg-blue-900'}`}>
                          {notif.message}
                        </li>
                      ))}
                    </ul>
                    <DialogFooter>
                      <Button onClick={markAllNotificationsAsRead}>Mark all as read</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-[#D0BFB4] hover:bg-[#C0AFA4] text-white">
                      <Zap className="mr-2 h-4 w-4" /> <span className="hidden md:inline">Quick Actions</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Quick Actions</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={() => handleCreateBlink("Quick Blink", "Created via Quick Actions")}>Create Blink</Button>
                      <Button>Send BARK</Button>
                      <Button>View Analytics</Button>
                      <Button>Edit Profile</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Blinks</CardTitle>
                  <BarChart className="h-4 w-4 text-[#D0BFB4]" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{blinks.length}</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" aria-hidden="true" />
                    20% from last month
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Your Blink collection is growing steadily!</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">BARK Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-[#D0BFB4]" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">5,678 BARK</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" aria-hidden="true" />
                    5% from last week
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Your BARK tokens are increasing in value!</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">BARK Membership</CardTitle>
                  <Crown className="h-4 w-4 text-[#D0BFB4]" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Active</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
                    Premium benefits unlocked
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Enjoy exclusive perks and early access!</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">BARK Mascot</CardTitle>
                  <Dog className="h-4 w-4 text-[#D0BFB4]" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">1 CNFT</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
                    Exclusive mascot owned
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Your unique BARK mascot is gaining popularity!</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-gray-800 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Featured Blinks</CardTitle>
              </CardHeader>
              <CardContent>
                <BlinkCarousel blinks={blinks.slice(0, 5)} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Blink Creation Over Time</CardTitle>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">Last Month</SelectItem>
                      <SelectItem value="3m">Last 3 Months</SelectItem>
                      <SelectItem value="6m">Last 6 Months</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="w-full h-[300px]" />
                  ) : error ? (
                    <div className="text-red-500">{error}</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Bar dataKey="value" fill="#D0BFB4" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Track your Blink creation progress over time. Keep up the great work!</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Blink Value Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={blinkValueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                      <Line type="monotone" dataKey="value" stroke="#D0BFB4" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Your Blinks are gaining value! Keep creating and engaging with the community.</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Blink Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={blinkPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {blinkPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SAND_COLORS[index % SAND_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {blinkPerformanceData.map((item, index) => (
                      <div key={item.name} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: SAND_COLORS[index % SAND_COLORS.length] }}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Your Blinks are performing well across different metrics. Focus on increasing shares and comments to boost engagement.</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Active Users</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">75%</span>
                      </div>
                      <Progress value={75} className="w-full" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blink Creation Rate</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">60%</span>
                      </div>
                      <Progress value={60} className="w-full" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community Interaction</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">85%</span>
                      </div>
                      <Progress value={85} className="w-full" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Great job on community interaction! Consider ways to increase the Blink creation rate to boost overall engagement.</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-gray-800 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Community Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blinks.slice(0, 5).map((blink, index) => (
                    <div key={blink.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{blink.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{blink.likes} likes • {blink.views} views</p>
                        </div>
                      </div>
                      <Trophy className={`h-5 w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-yellow-700' : 'text-gray-300'}`} aria-hidden="true" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Congratulations to our top performers! Keep creating and engaging to climb the leaderboard.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your Blinks</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#D0BFB4] hover:bg-[#C0AFA4] text-white">
                      <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Create Blink
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Blink</DialogTitle>
                      <DialogDescription>
                        Fill in the details to create your new Blink. Let your creativity shine!
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      const name = formData.get('name') as string
                      const description = formData.get('description') as string
                      handleCreateBlink(name, description)
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="name" className="text-right">
                            Name
                          </label>
                          <Input id="name" name="name" className="col-span-3" placeholder="Enter a catchy name for your Blink" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="description" className="text-right">
                            Description
                          </label>
                          <Input id="description" name="description" className="col-span-3" placeholder="Describe your Blink in a few words" required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Blink</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-6">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <Input 
                      type="search"
                      placeholder="Search your Blinks" 
                      className="pl-10 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 w-full"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <Button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="bg-[#D0BFB4] hover:bg-[#C0AFA4] text-white"
                    aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
                <Tabs defaultValue="grid" className="mb-6">
                  <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics View</TabsTrigger>
                  </TabsList>
                  <TabsContent value="grid">
                    <AnimatePresence>
                      <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {visibleBlinks.map((blink) => (
                          <motion.div
                            key={blink.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <BlinkCard
                              id={blink.id}
                              name={blink.name}
                              description={blink.description}
                              image={blink.image}
                              createdAt={blink.createdAt.toLocaleDateString()}
                              likes={blink.likes}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>
                  <TabsContent value="analytics">
                    <div className="space-y-4">
                      {visibleBlinks.map((blink) => (
                        <Card key={blink.id}>
                          <CardHeader>
                            <CardTitle>{blink.name}</CardTitle>
                            <CardDescription>{blink.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Likes</p>
                                <p className="text-2xl font-bold">{blink.likes}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shares</p>
                                <p className="text-2xl font-bold">{blink.shares}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</p>
                                <p className="text-2xl font-bold">{blink.comments}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Views</p>
                                <p className="text-2xl font-bold">{blink.views}</p>
                              </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Created on: {blink.createdAt.toLocaleDateString()}</p>
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Engagement Rate</p>
                              <Progress value={(blink.likes + blink.shares + blink.comments) / blink.views * 100} className="w-full mt-2" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                {visibleBlinks.length < sortedBlinks.length && (
                  <div className="flex justify-center mt-6">
                    <Button onClick={loadMore} className="bg-[#D0BFB4] hover:bg-[#C0AFA4] text-white">
                      Load More
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}