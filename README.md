# Scholarship Finder Application

A full-stack web application to help students find and match with relevant scholarships based on their academic profile, interests, and qualifications.

## Features

- **Student Profile Form**: Input academic details, interests, and special eligibility criteria
- **Advanced Matching Algorithm**: Match scholarships to student profiles based on multiple factors
- **Personalized Scholarship List**: View scholarships ranked by relevance, with deadline and amount details
- **Filter and Sort Options**: Refine results by amount, deadline, and other criteria
- **Favorite Scholarships**: Save scholarships of interest for later reference
- **Responsive Design**: Works seamlessly across all device sizes

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Lucide React (for icons)
- Axios (for API requests)
- date-fns (for date formatting)

### Backend
- Node.js
- Express.js
- MongoDB integration ready

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/scholarship-finder.git
cd scholarship-finder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
# Start both frontend and backend
npm run dev:all

# Or start them separately
npm run dev        # Frontend only
npm run server     # Backend only
```

4. Open your browser and navigate to `http://localhost:5173`

## MongoDB Integration

The application is ready to be connected to MongoDB. Follow these steps to set it up:

1. Create a MongoDB Atlas account or set up a local MongoDB server
2. Create a `.env` file in the root directory with your MongoDB URI:
```
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/scholarships?retryWrites=true&w=majority
```

3. Uncomment the MongoDB connection code in `server/index.js` and update the models as needed

## API Endpoints

- `GET /api/scholarships` - Get all scholarships
- `POST /api/match` - Match scholarships to a student profile

## Project Structure

```
scholarship-finder/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── controllers/
│   ├── data/
│   ├── models/
│   ├── routes/
│   └── index.js
└── package.json
```

## Future Enhancements

- User authentication and profile saving
- Email notifications for upcoming deadlines
- Admin dashboard for scholarship management
- Web scraper for automatic scholarship updates
- Application tracking functionality