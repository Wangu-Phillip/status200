import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { 
  Briefcase, 
  ArrowLeft, 
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  Filter,
  LogIn
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const API = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000") + "/api";

const categoryIcons = {
  it_software: "💻",
  infrastructure: "🏗️",
  consulting: "📊",
  equipment: "📡",
  maintenance: "🔧"
};

export default function TenderHub() {
  const { isAuthenticated } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tendersRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/tenders`),
        axios.get(`${API}/tenders/categories`)
      ]);
      setTenders(tendersRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching tenders:", error);
      toast.error("Failed to load tenders");
    } finally {
      setLoading(false);
    }
  };

  const filteredTenders = tenders.filter(t => 
    filterCategory === "all" || t.category === filterCategory
  );

  const getDaysRemaining = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="tender-hub">
      {/* Header */}
      <header className="bg-[#0A192F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 rounded-sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="font-heading font-bold text-lg">Tender Hub</h1>
            </div>
            {!isAuthenticated && (
              <Button asChild variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 rounded-sm">
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Apply
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#0A192F] text-white pb-12 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#75B2DD] text-xs uppercase tracking-[0.2em] font-semibold mb-2">
              BOCRA Procurement
            </p>
            <h2 className="font-heading font-bold text-3xl mb-4">
              Open Tender Opportunities
            </h2>
            <p className="text-slate-300 max-w-2xl">
              Browse current tender opportunities from BOCRA. Register and submit your proposals 
              to participate in Botswana's telecommunications regulatory projects.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {/* Filter */}
        <Card className="border border-slate-200 rounded-sm shadow-none mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-slate-400" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px] rounded-sm" data-testid="category-filter">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {categoryIcons[cat.id]} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-slate-500">
                {filteredTenders.length} tender{filteredTenders.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tenders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading tenders...</p>
          </div>
        ) : filteredTenders.length === 0 ? (
          <Card className="border border-slate-200 rounded-sm shadow-none">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl text-[#0A192F] mb-2">
                No Open Tenders
              </h3>
              <p className="text-slate-500">
                There are no tenders matching your criteria. Check back soon for new opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTenders.map((tender, index) => {
              const daysRemaining = getDaysRemaining(tender.deadline);
              const isUrgent = daysRemaining <= 7;
              
              return (
                <motion.div
                  key={tender.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-slate-200 rounded-sm shadow-none h-full card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Badge className="mb-2 bg-slate-100 text-slate-700 rounded-sm">
                            {categoryIcons[tender.category]} {categories.find(c => c.id === tender.category)?.name || tender.category}
                          </Badge>
                          <CardTitle className="font-heading text-lg text-[#0A192F] leading-tight">
                            {tender.title}
                          </CardTitle>
                        </div>
                        {isUrgent && (
                          <Badge className="bg-red-100 text-red-800 rounded-sm whitespace-nowrap">
                            {daysRemaining} days left
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {tender.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        {tender.budget_range && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <DollarSign className="w-4 h-4" />
                            <span>{tender.budget_range}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          asChild
                          className="w-full bg-[#0A192F] hover:bg-slate-800 text-white rounded-sm"
                          data-testid={`view-tender-${tender.id}`}
                        >
                          <Link to={`/tenders/${tender.id}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
