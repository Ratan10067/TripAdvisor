import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Users,
  Calendar,
  ArrowRight,
  Bot,
  X,
  Clock,
  Thermometer,
  Camera,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plane,
  Hotel,
  Car,
  UtensilsCrossed,
  Wifi,
  Car as CarIcon,
//   Swimming,
  Dumbbell,
  Coffee,
  Shield,
  Award,
  Globe,
  TrendingUp,
  Filter,
  Check
} from "lucide-react";

const Homepage = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  // Dummy API data - replace with actual API calls
  const destinations = [
    {
      id: 1,
      name: "Paris, France",
      country: "France",
      continent: "Europe",
      images: [
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
        "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1551634979-c11bad5f15d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      ],
      price: 1200,
      originalPrice: 1500,
      rating: 4.8,
      reviews: 234,
      description:
        "The City of Light awaits with its iconic landmarks, world-class museums, and romantic atmosphere. Experience the magic of Paris with guided tours of the Eiffel Tower, Louvre Museum, and charming Montmartre district.",
      duration: "7 days",
      bestTimeToVisit: "April - June, September - October",
      weather: "22°C",
      highlights: [
        "Eiffel Tower & Seine River Cruise",
        "Louvre Museum & Mona Lisa",
        "Versailles Palace Day Trip",
        "Montmartre & Sacré-Cœur",
        "Champs-Élysées Shopping",
      ],
      included: [
        "Round-trip flights",
        "4-star hotel accommodation",
        "Daily breakfast",
        "Guided city tours",
        "Museum passes",
        "Airport transfers",
      ],
      amenities: [
        { icon: <Wifi className="h-4 w-4" />, name: "Free WiFi" },
        { icon: <Car className="h-4 w-4" />, name: "Airport Transfer" },
        { icon: <UtensilsCrossed className="h-4 w-4" />, name: "Breakfast" },
        { icon: <Shield className="h-4 w-4" />, name: "Travel Insurance" },
      ],
      tags: ["Romantic", "Cultural", "Historical", "Art", "Food"],
      difficulty: "Easy",
      groupSize: "2-15 people",
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      country: "Japan",
      continent: "Asia",
      images: [
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80",
        "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      ],
      price: 1500,
      originalPrice: 1800,
      rating: 4.9,
      reviews: 189,
      description:
        "Experience the perfect blend of ancient traditions and cutting-edge technology in Japan's vibrant capital. From serene temples to bustling districts, Tokyo offers an unforgettable cultural journey.",
      duration: "8 days",
      bestTimeToVisit: "March - May, September - November",
      weather: "18°C",
      highlights: [
        "Senso-ji Temple & Asakusa",
        "Shibuya Crossing Experience",
        "Mount Fuji Day Trip",
        "Tsukiji Fish Market Tour",
        "Traditional Ryokan Stay",
      ],
      included: [
        "Round-trip flights",
        "Mix of hotels & ryokan",
        "JR Pass (7 days)",
        "Cultural experiences",
        "English-speaking guide",
        "Selected meals",
      ],
      amenities: [
        { icon: <Wifi className="h-4 w-4" />, name: "Free WiFi" },
        { icon: <Car className="h-4 w-4" />, name: "JR Pass" },
        {
          icon: <UtensilsCrossed className="h-4 w-4" />,
          name: "Traditional Meals",
        },
        { icon: <Camera className="h-4 w-4" />, name: "Photo Tours" },
      ],
      tags: ["Cultural", "Technology", "Food", "Traditional", "Modern"],
      difficulty: "Moderate",
      groupSize: "2-12 people",
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      country: "Indonesia",
      continent: "Asia",
      images: [
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1555400409-4e3c6bfb9a75?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      ],
      price: 800,
      originalPrice: 1000,
      rating: 4.7,
      reviews: 156,
      description:
        "Discover the Island of the Gods with its stunning beaches, ancient temples, and vibrant culture. Enjoy luxurious resorts, world-class spas, and breathtaking natural beauty.",
      duration: "6 days",
      bestTimeToVisit: "April - October",
      weather: "28°C",
      highlights: [
        "Tanah Lot Temple Sunset",
        "Ubud Rice Terraces",
        "Beach Day in Seminyak",
        "Traditional Balinese Spa",
        "Volcano Sunrise Trek",
      ],
      included: [
        "Round-trip flights",
        "Beach resort stay",
        "Daily breakfast",
        "Private transfers",
        "Temple tours",
        "Spa treatments",
      ],
      amenities: [
        // { icon: <Swimming className="h-4 w-4" />, name: "Beach Access" },
        { icon: <Dumbbell className="h-4 w-4" />, name: "Spa & Wellness" },
        {
          icon: <UtensilsCrossed className="h-4 w-4" />,
          name: "Local Cuisine",
        },
        { icon: <Car className="h-4 w-4" />, name: "Private Driver" },
      ],
      tags: ["Beach", "Spiritual", "Relaxation", "Adventure", "Tropical"],
      difficulty: "Easy",
      groupSize: "2-20 people",
    },
    {
      id: 4,
      name: "New York, USA",
      country: "USA",
      continent: "North America",
      images: [
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      ],
      price: 1000,
      originalPrice: 1250,
      rating: 4.6,
      reviews: 298,
      description:
        "The Big Apple never sleeps! Experience the energy of Manhattan with Broadway shows, world-class museums, iconic landmarks, and diverse neighborhoods.",
      duration: "5 days",
      bestTimeToVisit: "April - June, September - November",
      weather: "15°C",
      highlights: [
        "Statue of Liberty & Ellis Island",
        "Central Park & Times Square",
        "Broadway Show",
        "9/11 Memorial & Museum",
        "Brooklyn Bridge Walk",
      ],
      included: [
        "Round-trip flights",
        "Manhattan hotel",
        "Broadway show tickets",
        "Attraction passes",
        "Subway passes",
        "Food tour",
      ],
      amenities: [
        { icon: <Plane className="h-4 w-4" />, name: "Central Location" },
        { icon: <Camera className="h-4 w-4" />, name: "City Tours" },
        { icon: <UtensilsCrossed className="h-4 w-4" />, name: "Food Tours" },
        { icon: <Award className="h-4 w-4" />, name: "Skip-the-line" },
      ],
      tags: ["Urban", "Culture", "Entertainment", "Food", "Shopping"],
      difficulty: "Easy",
      groupSize: "2-25 people",
    },
    {
      id: 5,
      name: "Santorini, Greece",
      country: "Greece",
      continent: "Europe",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2019&q=80",
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      ],
      price: 1100,
      originalPrice: 1400,
      rating: 4.8,
      reviews: 167,
      description:
        "Experience the magic of the Greek islands with stunning sunsets, white-washed buildings, and crystal-clear waters. Perfect for romance and relaxation.",
      duration: "6 days",
      bestTimeToVisit: "May - October",
      weather: "25°C",
      highlights: [
        "Oia Sunset Views",
        "Fira Town Exploration",
        "Wine Tasting Tours",
        "Red Beach & Black Beach",
        "Volcano Island Trip",
      ],
      included: [
        "Round-trip flights",
        "Cliffside hotel",
        "Island transfers",
        "Wine tastings",
        "Sunset cruise",
        "Beach activities",
      ],
      amenities: [
        // { icon: <Swimming className="h-4 w-4" />, name: "Infinity Pool" },
        { icon: <Coffee className="h-4 w-4" />, name: "Wine Tasting" },
        { icon: <Camera className="h-4 w-4" />, name: "Sunset Views" },
        { icon: <Car className="h-4 w-4" />, name: "Island Tours" },
      ],
      tags: ["Romantic", "Island", "Sunset", "Wine", "Relaxation"],
      difficulty: "Easy",
      groupSize: "2-16 people",
    },
    {
      id: 6,
      name: "Dubai, UAE",
      country: "UAE",
      continent: "Asia",
      images: [
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1505998191505-6f0b1d4b123b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      ],
      price: 1300,
      originalPrice: 1600,
      rating: 4.7,
      reviews: 203,
      description:
        "Experience luxury and innovation in the desert jewel of the Middle East. From towering skyscrapers to traditional souks, Dubai offers a unique blend of modern and traditional.",
      duration: "5 days",
      bestTimeToVisit: "November - March",
      weather: "30°C",
      highlights: [
        "Burj Khalifa & Dubai Mall",
        "Desert Safari Experience",
        "Palm Jumeirah & Atlantis",
        "Dubai Marina & JBR",
        "Gold & Spice Souks",
      ],
      included: [
        "Round-trip flights",
        "5-star hotel",
        "Desert safari",
        "City tours",
        "Luxury transfers",
        "Shopping experiences",
      ],
      amenities: [
        { icon: <Hotel className="h-4 w-4" />, name: "5-Star Luxury" },
        { icon: <Car className="h-4 w-4" />, name: "Luxury Transfers" },
        // { icon: <Swimming className="h-4 w-4" />, name: "Beach & Pool" },
        { icon: <Award className="h-4 w-4" />, name: "VIP Experiences" },
      ],
      tags: ["Luxury", "Modern", "Desert", "Shopping", "Architecture"],
      difficulty: "Easy",
      groupSize: "2-20 people",
    },
  ];

  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Search",
      description:
        "Find your perfect destination with our intelligent search engine that learns your preferences.",
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Local Experiences",
      description:
        "Connect with verified local guides and discover hidden gems off the beaten path.",
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: "Seamless Booking",
      description:
        "Book flights, hotels, activities, and experiences all in one integrated platform.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Travel Community",
      description:
        "Join millions of travelers sharing reviews, tips, and unforgettable experiences.",
    },
  ];

  const stats = [
    { icon: <Globe className="h-6 w-6" />, value: "150+", label: "Countries" },
    {
      icon: <Users className="h-6 w-6" />,
      value: "2M+",
      label: "Happy Travelers",
    },
    {
      icon: <Award className="h-6 w-6" />,
      value: "50K+",
      label: "5-Star Reviews",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      value: "99%",
      label: "Satisfaction Rate",
    },
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesPrice =
      dest.price >= priceRange[0] && dest.price <= priceRange[1];
    const matchesRating = dest.rating >= ratingFilter;
    return matchesSearch && matchesPrice && matchesRating;
  });

  const nextImage = () => {
    if (selectedDestination) {
      setCurrentImageIndex((prev) =>
        prev === selectedDestination.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedDestination) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedDestination.images.length - 1 : prev - 1
      );
    }
  };

  const openDestinationDetails = (destination) => {
    setSelectedDestination(destination);
    setCurrentImageIndex(0);
  };

  const closeDestinationDetails = () => {
    setSelectedDestination(null);
  };

  const LoadingCard = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-blue-100 leading-relaxed">
              Explore the world with confidence. Get personalized travel
              recommendations, book amazing experiences, and create memories
              that last a lifetime.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-2 border border-white/20">
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Where do you want to go?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 text-gray-900 bg-white rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 placeholder-gray-500"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="ml-2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>

                {showFilters && (
                  <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Price Range
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="0"
                            max="3000"
                            value={priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([0, parseInt(e.target.value)])
                            }
                            className="flex-1"
                          />
                          <span className="text-white whitespace-nowrap">
                            ${priceRange[1]}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Minimum Rating
                        </label>
                        <select
                          value={ratingFilter}
                          onChange={(e) =>
                            setRatingFilter(parseFloat(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-white/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          <option value="0" className="text-gray-900">
                            Any Rating
                          </option>
                          <option value="4.0" className="text-gray-900">
                            4.0+ Stars
                          </option>
                          <option value="4.5" className="text-gray-900">
                            4.5+ Stars
                          </option>
                          <option value="4.8" className="text-gray-900">
                            4.8+ Stars
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2 text-blue-200">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group flex items-center space-x-3 bg-white text-blue-600 px-10 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Bot className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>Ask AI Assistant</span>
              </button>
              <button className="group flex items-center space-x-3 border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm">
                <span>Explore Destinations</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose TravelMate?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make travel planning simple, personalized, and unforgettable
              with cutting-edge technology and local expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white border border-gray-100"
              >
                <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most loved destinations by our travelers around the
              world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <LoadingCard key={index} />
                ))
              : filteredDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => openDestinationDetails(destination)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={destination.images[0]}
                        alt={destination.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                          ${destination.price}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(destination.id);
                          }}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.has(destination.id)
                                ? "text-red-500 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                        {destination.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-blue-600/80 text-white px-2 py-1 rounded-md text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}{" "}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {destination.name}
                        </h3>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="ml-1 text-gray-900 font-medium">
                            {destination.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {destination.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{destination.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Thermometer className="h-4 w-4 mr-1" />
                          <span>{destination.weather}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {filteredDestinations.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="mx-auto flex justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No destinations found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Destination Details Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-900 bg-opacity-75"
                onClick={closeDestinationDetails}
              ></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-t-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full sm:rounded-2xl">
              <div className="bg-white">
                {/* Image Gallery */}
                <div className="relative h-96 w-full bg-gray-200">
                  <img
                    src={selectedDestination.images[currentImageIndex]}
                    alt={selectedDestination.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-800" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-800" />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {selectedDestination.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-3 h-3 rounded-full ${
                          currentImageIndex === index
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-8 sm:px-10 sm:py-12">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900">
                            {selectedDestination.name}
                          </h2>
                          <div className="flex items-center mt-2 text-gray-600">
                            <MapPin className="h-5 w-5 mr-1" />
                            <span>
                              {selectedDestination.country},{" "}
                              {selectedDestination.continent}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              toggleFavorite(selectedDestination.id)
                            }
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Heart
                              className={`h-6 w-6 ${
                                favorites.has(selectedDestination.id)
                                  ? "text-red-500 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Share2 className="h-6 w-6 text-gray-400" />
                          </button>
                          <button
                            onClick={closeDestinationDetails}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <X className="h-6 w-6 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 mb-8">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">
                            {selectedDestination.rating} (
                            {selectedDestination.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-5 w-5 mr-1" />
                          <span>{selectedDestination.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Thermometer className="h-5 w-5 mr-1" />
                          <span>{selectedDestination.weather}</span>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Overview</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedDestination.description}
                        </p>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">
                          Highlights
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedDestination.highlights.map(
                            (highlight, index) => (
                              <li key={index} className="flex items-start">
                                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                                  <ArrowRight className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-gray-700">
                                  {highlight}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">
                          Best Time to Visit
                        </h3>
                        <p className="text-gray-700">
                          {selectedDestination.bestTimeToVisit}
                        </p>
                      </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:w-96 bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            ${selectedDestination.price}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${selectedDestination.originalPrice}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          per person, including taxes and fees
                        </p>
                        <div className="flex items-center text-sm text-green-600">
                          <span className="bg-green-100 px-2 py-1 rounded-md">
                            Limited time deal
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">
                          What's Included
                        </h3>
                        <ul className="space-y-2">
                          {selectedDestination.included.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="bg-blue-100 p-0.5 rounded-full mr-2 mt-0.5">
                                <Check className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">
                          Amenities
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedDestination.amenities.map(
                            (amenity, index) => (
                              <div key={index} className="flex items-center">
                                <div className="text-blue-600 mr-2">
                                  {amenity.icon}
                                </div>
                                <span className="text-gray-700 text-sm">
                                  {amenity.name}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">
                          Group Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Group Size
                              </p>
                              <p className="font-medium">
                                {selectedDestination.groupSize}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Difficulty
                              </p>
                              <p className="font-medium">
                                {selectedDestination.difficulty}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join millions of travelers who trust us to make their travel dreams
            come true.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Explore All Destinations
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6">TravelMate</h3>
              <p className="text-gray-400 mb-6">
                Making travel planning simple, personalized, and unforgettable.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Destinations</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Europe
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Asia
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    North America
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    South America
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Africa
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Oceania
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Safety Information
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cancellation Options
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Report Issue
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Travel Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 TravelMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
