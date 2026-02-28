import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Menu, X, Filter } from 'lucide-react';
import { searchFacilities, getFacilities } from '../services/api';

function Sidebar({ isOpen, toggleSidebar, onRouteSelect }) {
    const [activeTab, setActiveTab] = useState('search'); // 'search' or 'navigate'
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            setIsSearching(true);
            const results = await searchFacilities(query);
            setSearchResults(results);
            setIsSearching(false);
        } else {
            setSearchResults([]);
        }
    };

    // State for Navigation tab
    const [allFacilities, setAllFacilities] = useState([]);
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');

    useEffect(() => {
        // Load all facilities for the dropdowns
        const loadFacilities = async () => {
            const data = await getFacilities();
            if (data) setAllFacilities(data);
        };
        loadFacilities();
    }, []);

    const handleNavigate = () => {
        if (startPoint && endPoint && onRouteSelect) {
            onRouteSelect(startPoint, endPoint);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden absolute top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-700 hover:text-brand-600 transition-colors"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40
                w-80 bg-white/95 backdrop-blur-xl shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] border-r border-gray-100/50
                transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0'}
            `}>
                {isOpen && (
                    <div className="flex flex-col h-full w-80">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100/50 bg-gradient-to-b from-brand-50/50 to-transparent">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                                <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                                    <MapPin size={20} />
                                </div>
                                Campus Navigator
                            </h1>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-3 gap-2 bg-gray-50/50">
                            <button
                                onClick={() => setActiveTab('search')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'search'
                                    ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-brand-600 ring-1 ring-gray-100'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                                    }`}
                            >
                                Find Place
                            </button>
                            <button
                                onClick={() => setActiveTab('navigate')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'navigate'
                                    ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-brand-600 ring-1 ring-gray-100'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                                    }`}
                            >
                                Directions
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {activeTab === 'search' ? (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search buildings, rooms..."
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-sm placeholder:font-normal shadow-sm"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                        />
                                    </div>

                                    {/* Filter Pills */}
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {['All', 'Classroom', 'Lab', 'Office', 'Library'].map((filter) => (
                                            <button key={filter} className="whitespace-nowrap px-4 py-1.5 bg-gray-50 hover:bg-brand-50 border border-gray-100 hover:border-brand-200 text-gray-600 hover:text-brand-700 rounded-full text-xs font-semibold transition-all">
                                                {filter}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Results List */}
                                    <div className="mt-4 space-y-3">
                                        {isSearching ? (
                                            <div className="flex justify-center py-8">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map((facility) => (
                                                <div key={facility.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5">
                                                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-600 transition-colors">{facility.name}</h3>
                                                    <p className="text-xs text-gray-500 mt-1.5">{facility.building} • Floor {facility.floor}</p>
                                                    <div className="mt-3 inline-block px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-100">
                                                        {facility.type}
                                                    </div>
                                                </div>
                                            ))
                                        ) : searchQuery.length > 2 ? (
                                            <p className="text-center text-gray-500 text-sm py-8 font-medium">No locations found.</p>
                                        ) : (
                                            <div className="text-center py-10">
                                                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Navigation className="text-brand-300" size={28} />
                                                </div>
                                                <h3 className="text-gray-900 font-semibold mb-1">Where to?</h3>
                                                <p className="text-sm text-gray-500">Search for a room or building to get started.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-8 w-0.5 h-12 bg-gray-100 z-0"></div>

                                            <div className="relative z-10 mb-5">
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-600 mb-1.5 ml-1">Starting Point</label>
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-brand-500 mr-2 shrink-0 shadow-[0_0_0_4px_#f0fdfa]"></div>
                                                    <select
                                                        className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 outline-none font-medium text-gray-700 transition-all hover:bg-gray-50 appearance-none"
                                                        value={startPoint}
                                                        onChange={(e) => setStartPoint(e.target.value)}
                                                    >
                                                        <option value="">Select starting location...</option>
                                                        {allFacilities.map(f => (
                                                            <option key={f.id} value={f.id}>{f.name} ({f.building})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="relative z-10">
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-orange-500 mb-1.5 ml-1">Destination</label>
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full border-2 border-orange-500 bg-white mr-1.5 shrink-0"></div>
                                                    <select
                                                        className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 outline-none font-medium text-gray-700 transition-all hover:bg-gray-50 appearance-none"
                                                        value={endPoint}
                                                        onChange={(e) => setEndPoint(e.target.value)}
                                                    >
                                                        <option value="">Select destination...</option>
                                                        {allFacilities.map(f => (
                                                            <option key={f.id} value={f.id}>{f.name} ({f.building})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleNavigate}
                                            disabled={!startPoint || !endPoint}
                                            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_14px_0_rgba(13,148,136,0.39)] disabled:shadow-none mt-2 flex justify-center items-center gap-2"
                                        >
                                            <Navigation size={18} />
                                            Get Directions
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Sidebar;
