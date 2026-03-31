export const categories = [
  {
    id: 'books',
    title: 'Books',
    listings: '1.2k+ Listings',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'electronics',
    title: 'Electronics',
    listings: '450+ Listings',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'furniture',
    title: 'Furniture',
    listings: '320+ Listings',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'notes',
    title: 'Notes',
    listings: '890+ Listings',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  },
]

export const products = [
  {
    id: 'p1',
    title: 'Advanced Calculus: 9th Ed',
    price: 45,
    originalPrice: 89,
    category: 'books',
    condition: 'Like New',
    distance: '0.2 miles away',
    seller: 'Sarah M.',
    tag: 'Used - Like New',
    description: 'Hardcover. Includes unused online access code.',
    image:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p2',
    title: 'Bose QuietComfort 35',
    price: 120,
    originalPrice: 299,
    category: 'electronics',
    condition: 'Good',
    distance: '1.5 miles away',
    seller: 'James K.',
    tag: 'Electronics',
    description: 'Great condition. Perfect for study sessions.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p3',
    title: 'Ergonomic Desk Chair',
    price: 65,
    originalPrice: 140,
    category: 'furniture',
    condition: 'Gently Used',
    distance: 'On-Campus',
    seller: 'Elena R.',
    tag: 'Furniture',
    description: 'Barely used, moving out of state. Must go!',
    image:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p4',
    title: 'Organic Chemistry Notes Bundle',
    price: 20,
    originalPrice: 50,
    category: 'notes',
    condition: 'Like New',
    distance: '0.8 miles away',
    seller: 'Mia T.',
    tag: 'Notes',
    description: 'Color-coded notes for Chem 101 and 102.',
    image:
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p5',
    title: 'iPad Air (5th Gen) + Pencil',
    price: 450,
    originalPrice: 699,
    category: 'electronics',
    condition: 'Like New',
    distance: 'West Commons',
    seller: 'Noah P.',
    tag: 'Electronics',
    description: 'Includes Apple Pencil and matte screen protector.',
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p6',
    title: 'Dorm Loft Storage Set',
    price: 35,
    originalPrice: 79,
    category: 'furniture',
    condition: 'Good',
    distance: '2.0 miles away',
    seller: 'Olivia J.',
    tag: 'Dorm Life',
    description: 'Stackable bins and organizer trays.',
    image:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
  },
]

export const conversations = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    status: 'online',
    preview: 'Is the Calculus textbook still available?',
    time: '2m ago',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'c2',
    name: 'Marcus Chen',
    status: 'offline',
    preview: 'I can meet at the Student Union at 4 PM.',
    time: '1h ago',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'c3',
    name: 'Emma Johnson',
    status: 'offline',
    preview: 'Thanks! The bike works great.',
    time: 'Yesterday',
    initials: 'EJ',
  },
]

export const messages = [
  {
    id: 'm1',
    from: 'them',
    text: 'Hi Alex! I saw your listing for the Calculus textbook. Is it still available?',
    time: '10:42 AM',
  },
  {
    id: 'm2',
    from: 'me',
    text: 'Hey Sarah! Yes, it is. No highlighting and great condition.',
    time: '10:45 AM',
  },
  {
    id: 'm3',
    from: 'them',
    text: 'Perfect. Would you take $40? I can meet this afternoon.',
    time: '10:47 AM',
  },
  {
    id: 'm4',
    from: 'me',
    text: 'Works for me. Library entrance at 2 PM?',
    time: '10:50 AM',
  },
]

export const userProfile = {
  name: 'Alex Rivers',
  college: 'Stanford University • Class of 2025',
  email: 'alex.rivers@stanford.edu',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  cover:
    'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1400&q=80',
  stats: [
    { label: 'Active Listings', value: '24' },
    { label: 'Avg. Rating', value: '4.9 (42 reviews)' },
    { label: 'Successful Sales', value: '118' },
  ],
}
