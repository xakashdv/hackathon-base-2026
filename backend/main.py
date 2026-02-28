from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="Campus Navigation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Location(BaseModel):
    x: float
    y: float

class Facility(BaseModel):
    id: str
    name: str
    type: str # e.g., "classroom", "laboratory", "office", "cafeteria", "library", "restroom", "parking"
    description: str
    location: Location
    building: str
    floor: int

# Mock Database of Facilities - Single College Campus (e.g., coordinates near a real campus area like Stanford for realistic Leaflet rendering)
# Using roughly Lat/Lng format for realistic Leaflet map handling
# Center roughly: 37.4275, -122.1697 (Stanford)
MOCK_FACILITIES = [
    # Main Academic Buildings (Quad Area)
    Facility(id="BLD-MAIN-101", name="Main Lecture Hall 101", type="classroom", description="Large tiered lecture hall for introductory courses", location=Location(y=37.4275, x=-122.1697), building="Main Academic Center", floor=1),
    Facility(id="BLD-MAIN-102", name="Seminar Room A", type="classroom", description="Small seminar room for graduate discussions", location=Location(y=37.4276, x=-122.1698), building="Main Academic Center", floor=1),
    Facility(id="BLD-MAIN-201", name="Dean's Office", type="office", description="Office of the Dean of Humanities", location=Location(y=37.4275, x=-122.1697), building="Main Academic Center", floor=2),
    
    # Science & Engineering Complex
    Facility(id="LAB-ENG-01", name="Robotics Lab", type="laboratory", description="Advanced robotics and automation workspace", location=Location(y=37.4285, x=-122.1710), building="Engineering Quad", floor=1),
    Facility(id="LAB-ENG-02", name="Computer Lab 3", type="laboratory", description="24/7 access computer lab with dual monitors", location=Location(y=37.4286, x=-122.1708), building="Engineering Quad", floor=1),
    Facility(id="CLASS-ENG-105", name="Engineering Hall 105", type="classroom", description="Medium lecture hall with drafting tables", location=Location(y=37.4284, x=-122.1712), building="Engineering Quad", floor=1),
    Facility(id="OFF-CS-300", name="CS Faculty Offices", type="office", description="Computer Science faculty and TA offices", location=Location(y=37.4285, x=-122.1710), building="Engineering Quad", floor=3),

    # Library & Study
    Facility(id="LIB-MAIN", name="Central Library", type="library", description="Main campus library, study areas, and archives", location=Location(y=37.4265, x=-122.1670), building="Library", floor=1),
    Facility(id="LIB-QUIET", name="Quiet Study Zone", type="library", description="Absolute silence study area", location=Location(y=37.4264, x=-122.1671), building="Library", floor=2),
    
    # Student Life
    Facility(id="CAF-01", name="Student Union Dining", type="cafeteria", description="Main food court, coffee shop, and lounge", location=Location(y=37.4250, x=-122.1690), building="Student Union", floor=1),
    Facility(id="GYM-01", name="Campus Recreation Center", type="gym", description="Gymnasium, weights, and indoor track", location=Location(y=37.4235, x=-122.1730), building="Athletics Complex", floor=1),
    
    # Utilities
    Facility(id="REST-MAIN-01", name="Main Quad Restrooms", type="restroom", description="Public restrooms near the main lecture halls", location=Location(y=37.4274, x=-122.1696), building="Main Academic Center", floor=1),
    Facility(id="PRK-NORTH", name="North Parking Structure", type="parking", description="Student and visitor parking structure", location=Location(y=37.4300, x=-122.1700), building="Outside", floor=0),
]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Campus Navigation API"}

@app.get("/api/facilities", response_model=List[Facility])
def get_facilities(
    type: Optional[str] = Query(None, description="Filter generic type, e.g., 'classroom'"),
    building: Optional[str] = Query(None, description="Filter by building"),
):
    results = MOCK_FACILITIES
    if type:
        results = [f for f in results if f.type.lower() == type.lower()]
    if building:
        results = [f for f in results if f.building.lower() == building.lower()]
    return results

@app.get("/api/search", response_model=List[Facility])
def search_facilities(q: str = Query(..., min_length=1, description="Search query string")):
    q_lower = q.lower()
    results = [
        f for f in MOCK_FACILITIES 
        if q_lower in f.name.lower() or q_lower in f.description.lower() or q_lower in f.type.lower()
    ]
    return results

@app.get("/api/route")
def get_route(start_id: str, end_id: str):
    # Mocking simple route information
    start_fac = next((f for f in MOCK_FACILITIES if f.id == start_id), None)
    end_fac = next((f for f in MOCK_FACILITIES if f.id == end_id), None)
    
    if not start_fac or not end_fac:
        raise HTTPException(status_code=404, detail="Start or End facility not found")
        
    return {
        "start": start_fac,
        "end": end_fac,
        "distance_estimate_meters": abs(start_fac.location.x - end_fac.location.x) * 10 + abs(start_fac.location.y - end_fac.location.y) * 10,
        "instructions": [
            f"Start at {start_fac.name}",
            f"Head towards {end_fac.building}",
            f"Arrive at {end_fac.name}"
        ],
        "path": [
            start_fac.location.model_dump(),
            {"x": (start_fac.location.x + end_fac.location.x)/2, "y": start_fac.location.y},
            end_fac.location.model_dump()
        ]
    }
