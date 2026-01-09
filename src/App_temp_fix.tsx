// Temp file with just the navigation section fixed
<button
  onClick={() => setCurrentPage('emergency')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
    currentPage === 'emergency' ? 'bg-blue-900 text-white' : 'hover:bg-blue-100'
  }`}
>
  <AlertCircle className="w-4 h-4" />
  <span>Emergency</span>
</button>
<button
  onClick={() => setCurrentPage('profile')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
    currentPage === 'profile' ? 'bg-blue-900 text-white' : 'hover:bg-blue-100'
  }`}
>
  <User className="w-4 h-4" />
  <span>Profile</span>
</button>
