import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import {
  Container, Grid, Card, CardContent, CardMedia,
  Typography, Button, TextField, IconButton, InputAdornment,
  Alert, Box, Modal, Paper, Chip, AppBar, Toolbar,
  Avatar, Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  RestaurantMenu as RestaurantMenuIcon,
  ContactMail as ContactIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  Star as StarIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Link as ScrollLink } from 'react-scroll';

const API_URL = 'https://mishal-s-web-backend.onrender.com/recipes';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await axios.get(API_URL);
      } catch (err) {
        // ignore
      }
      setTimeout(() => setIsLoading(false), 3000);
    };
    loadData();

    fetchRecipes();
  }, []);

  useEffect(() => {
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(filtered);
  }, [searchTerm, recipes]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(API_URL);
      setRecipes(response.data);
    } catch (err) {
      setError('Failed to load recipes');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!name || !ingredients || !instructions) {
      setError('All fields are required!');
      return;
    }

    const recipeData = { name, ingredients, instructions, image: image || '' };

    try {
      if (selectedRecipe) {
        await axios.put(`${API_URL}/${selectedRecipe.id}`, recipeData);
        setSuccess('Recipe updated successfully! ✨');
      } else {
        await axios.post(API_URL, recipeData);
        setSuccess('New recipe added! 🍳');
      }
      fetchRecipes();
      resetForm();
      setOpenForm(false);
    } catch (err) {
      setError('Something went wrong!');
    }
  };

  const handleEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setName(recipe.name);
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
    setImage(recipe.image || '');
    setOpenForm(true);
  };

  const handleView = (recipe) => {
    setViewRecipe(recipe);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recipe forever?')) {
      await axios.delete(`${API_URL}/${id}`);
      setSuccess('Recipe deleted!');
      fetchRecipes();
    }
  };

  const resetForm = () => {
    setSelectedRecipe(null);
    setName('');
    setIngredients('');
    setInstructions('');
    setImage('');
    setError('');
    setSuccess('');
  };

  const openAddRecipeModal = () => {
    resetForm();
    setOpenForm(true);
  };

  const dishImages = [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1659275799237-cbc057d97e7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://media.istockphoto.com/id/1314329942/photo/goal-gappa-or-pani-puri.webp?a=1&b=1&s=612x612&w=0&k=20&c=gipl8gjcid4yNp9cIjVEvhyAFdlFyplwGXYgRv0jdoI=',
    'https://media.istockphoto.com/id/504338599/photo/tender-beef-nihari.jpg?s=612x612&w=0&k=20&c=slp7Wnsi03ICCR3c-fBa0DxxhQjhPiV92PKXSdVOsmU=',
 
  ];

  return (
    <>
      {/* AESTHETIC WELCOME LOADING SCREEN WITH ROTATING DISHES */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'linear-gradient(135deg, #8a2be2, #ff1493, #00ced1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Box sx={{ position: 'relative', width: 400, height: 400 }}>
              {dishImages.map((src, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 120,
                    height: 120,
                    marginTop: -60,
                    marginLeft: -60,
                  }}
                  animate={{
                    x: [0, 180 * Math.cos((i * Math.PI * 2) / 8), 0],
                    y: [0, 180 * Math.sin((i * Math.PI * 2) / 8), 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.6,
                  }}
                >
                  <motion.img
                    src={src}
                    alt="dish"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                    }}
                    whileHover={{ scale: 1.4, rotate: 20 }}
                  />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1.2 }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, textAlign: 'center', textShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
                  Welcome to FlavorForge
                </Typography>
                <Typography variant="h6" sx={{ color: '#fff', mt: 3, textAlign: 'center', opacity: 0.9 }}>
                  Preparing your magical cookbook...
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EPIC PARTICLES BACKGROUND – More Sparkly & Magical */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: '#0a001f' } },
          fpsLimit: 120,
          particles: {
            color: { value: ['#ff006e', '#3a86ff', '#ffbe0b', '#8338ec', '#fb5607', '#00f5ff'] },
            links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.5, width: 1 },
            move: { enable: true, speed: 4, direction: 'none', random: true, outModes: 'bounce' },
            number: { density: { enable: true, area: 800 }, value: 150 },
            opacity: { value: { min: 0.3, max: 0.8 }, animation: { enable: true, speed: 1 } },
            size: { value: { min: 1, max: 7 }, animation: { enable: true, speed: 3 } },
            shape: { type: ['circle', 'star'] },
          },
          detectRetina: true,
        }}
      />

      {/* Glowing Navigation */}
      <AppBar position="sticky" sx={{ background: 'rgba(10, 0, 31, 0.95)', backdropFilter: 'blur(30px)', boxShadow: '0 8px 40px rgba(138,43,226,0.6)' }}>
        <Toolbar sx={{ justifyContent: 'center', gap: 8 }}>
          {['Home', 'About', 'Recipes', 'Contact'].map((text, i) => (
            <motion.div key={text} whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }}>
              <ScrollLink to={text.toLowerCase()} smooth={true}>
                <Button color="inherit" sx={{ fontWeight: 'bold', fontSize: '1.1rem', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                  {text}
                </Button>
              </ScrollLink>
            </motion.div>
          ))}
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        cursor: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><path fill=\'%23ff006e\' d=\'M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 26c-6.6 0-12-5.4-12-12S9.4 4 16 4s12 5.4 12 12-5.4 12-12 12z\'/><circle fill=\'%233a86ff\' cx=\'16\' cy=\'16\' r=\'6\'/></svg>") 16 16, auto'
      }}>
        {/* WELCOME SCREEN – Flying Text & Epic Entrance with YOUR IMAGE */}
        <Box id="home" sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          backgroundImage: `linear-gradient(135deg, rgba(138, 43, 226, 0.7) 0%, rgba(255, 20, 147, 0.6) 50%, rgba(0, 206, 209, 0.7) 100%), url(${require('./image.png').default})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(10,150,158,0.48)' }} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            sx={{ position: 'relative', zIndex: 2 }}
          >
            {/* Flying Letters for "FlavorForge" */}
            <Typography variant="h1" sx={{ fontSize: { xs: '4.5rem', md: '8rem' }, fontWeight: 900, mb: 4 }}>
              {'FlavorForge'.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 200, rotate: Math.random() * 360 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: i * 0.1, duration: 1.2, type: 'spring', bounce: 0.6 }}
                  style={{ display: 'inline-block', textShadow: '0 0 30px rgba(255,255,255,0.8)' }}
                  sx={{
                    background: 'linear-gradient(45deg, #ff006e, #3a86ff, #ffbe0b)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </Typography>

            {/* Subtitle with Pulse Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <Typography variant="h4" sx={{ color: '#fff', mb: 8, fontWeight: 700, textShadow: '0 0 30px rgba(0,0,0,0.7)' }}>
                Your Personal Cookbook – Beautiful, Simple, Delicious
              </Typography>
            </motion.div>

            {/* Floating Button with Glow */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1.2 }}
              whileHover={{ scale: 1.2, boxShadow: '0 0 50px rgba(58,134,255,0.8)' }}
              whileTap={{ scale: 0.9 }}
            >
              <ScrollLink to="recipes" smooth={true}>
                <Button 
                  variant="contained" 
                  size="large" 
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ 
                    borderRadius: 50, 
                    px: 8, 
                    py: 4, 
                    fontSize: '1.5rem',
                    background: 'linear-gradient(45deg, #ff006e, #3a86ff)',
                    boxShadow: '0 15px 40px rgba(58,134,255,0.7)',
                  }}
                >
                  Start Your Journey
                </Button>
              </ScrollLink>
            </motion.div>
          </motion.div>
        </Box>

        {/* About – Floating Cards with Glow */}
        <Container id="about" sx={{ py: 16 }}>
          <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontWeight: 900, 
                mb: 8,
                background: 'linear-gradient(45deg, #ff006e, #3a86ff, #ffbe0b)', 
                backgroundClip: 'text', 
                WebkitBackgroundClip: 'text', 
                color: 'transparent',
                textShadow: '0 0 30px rgba(255,255,255,0.5)'
              }}
            >
              Welcome to FlavorForge
            </Typography>
            <Grid container spacing={6}>
              {[
                { icon: <RestaurantMenuIcon fontSize="large" />, title: "Unlimited Recipes", desc: "Create and save as many delicious recipes as you want" },
                { icon: <TimerIcon fontSize="large" />, title: "Step-by-Step", desc: "Clear, easy-to-follow cooking instructions" },
                { icon: <PeopleIcon fontSize="large" />, title: "For Everyone", desc: "Perfect for beginners and master chefs alike" },
                { icon: <StarIcon fontSize="large" />, title: "Stunning Design", desc: "A beautiful, joyful experience every time" }
              ].map((item, i) => (
                <Grid item xs={12} md={3} key={i}>
                  <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.8, type: 'spring' }}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 10, 
                      y: -30,
                      boxShadow: '0 30px 60px rgba(138,43,226,0.6)'
                    }}
                  >
                    <Card sx={{ 
                      p: 6, 
                      textAlign: 'center', 
                      bgcolor: 'rgba(255,255,255,0.92)', 
                      backdropFilter: 'blur(15px)', 
                      borderRadius: 5,
                      boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                      height: '100%',
                      transition: 'all 0.5s ease'
                    }}>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 6 }}
                      >
                        <Avatar sx={{ bgcolor: 'linear-gradient(45deg, #ff006e, #3a86ff)', width: 100, height: 100, mx: 'auto', mb: 4 }}>
                          {item.icon}
                        </Avatar>
                      </motion.div>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3a86ff', mb: 2 }}>{item.title}</Typography>
                      <Typography variant="body1" color="text.secondary">{item.desc}</Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>

        {/* Recipes – Floating Cards with Magic */}
        <Box id="recipes" sx={{ py: 16, bgcolor: '#f8fafc' }}>
          <Container maxWidth="lg">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
              <Typography 
                variant="h3" 
                align="center" 
                gutterBottom 
                sx={{ 
                  fontWeight: 900, 
                  mb: 8,
                  background: 'linear-gradient(45deg, #ff006e, #3a86ff, #ffbe0b)', 
                  backgroundClip: 'text', 
                  WebkitBackgroundClip: 'text', 
                  color: 'transparent',
                  textShadow: '0 0 40px rgba(255,255,255,0.7)'
                }}
              >
                Your Recipe Collection
              </Typography>
            </motion.div>

            {/* Search with Glow */}
            <Box sx={{ mb: 10, display: 'flex', justifyContent: 'center' }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <TextField
                  placeholder="Search magical recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ 
                    width: { xs: '100%', md: 700 }, 
                    bgcolor: 'white', 
                    borderRadius: 50,
                    '& .MuiOutlinedInput-root': { borderRadius: 50 }
                  }}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  }}
                  variant="outlined"
                />
              </motion.div>
            </Box>

            {/* Epic Add Button */}
            <Box sx={{ textAlign: 'center', mb: 12 }}>
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={openAddRecipeModal}
                  sx={{ 
                    px: 10, 
                    py: 4, 
                    borderRadius: 50, 
                    fontSize: '1.8rem',
                    background: 'linear-gradient(45deg, #ff006e, #3a86ff)',
                    boxShadow: '0 20px 50px rgba(58,134,255,0.7)',
                  }}
                >
                  Create New Recipe
                </Button>
              </motion.div>
            </Box>

            {/* Floating Recipe Cards */}
            <Grid container spacing={6}>
              <AnimatePresence>
                {filteredRecipes.map((recipe, index) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 100, rotate: -10 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ delay: index * 0.15, duration: 1, type: 'spring', bounce: 0.5 }}
                      whileHover={{ 
                        y: -40, 
                        scale: 1.1, 
                        rotate: 5,
                        boxShadow: '0 40px 80px rgba(138,43,226,0.8)'
                      }}
                    >
                      <Card sx={{ 
                        borderRadius: 6, 
                        overflow: 'hidden', 
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        height: '100%',
                        bgcolor: 'rgba(255,255,255,0.98)',
                        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}>
                        <CardMedia
                          component="img"
                          height="320"
                          image={recipe.image || 'https://via.placeholder.com/400x320?text=Magical+Recipe'}
                          alt={recipe.name}
                        />
                        <CardContent>
                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #ff006e, #3a86ff)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                            {recipe.name}
                          </Typography>
                          <Chip label={`${recipe.ingredients.split(',').length} ingredients`} color="primary" sx={{ mb: 3 }} />
                          <Typography variant="body1" color="text.secondary">
                            {recipe.instructions.substring(0, 120)}...
                          </Typography>
                        </CardContent>
                        <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between' }}>
                          <motion.div whileHover={{ scale: 1.2 }}>
                            <Button 
                              variant="contained" 
                              startIcon={<ViewIcon />}
                              onClick={(e) => { e.stopPropagation(); handleView(recipe); }}
                              sx={{ borderRadius: 30, background: 'linear-gradient(45deg, #ff006e, #3a86ff)', boxShadow: '0 10px 20px rgba(58,134,255,0.4)' }}
                            >
                              View
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.2 }}>
                            <Button 
                              variant="contained" 
                              color="secondary" 
                              onClick={(e) => { e.stopPropagation(); handleEdit(recipe); }}
                              sx={{ borderRadius: 30 }}
                            >
                              Edit
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.2 }}>
                            <Button 
                              variant="outlined" 
                              color="error" 
                              onClick={(e) => { e.stopPropagation(); handleDelete(recipe.id); }}
                              sx={{ borderRadius: 30 }}
                            >
                              Delete
                            </Button>
                          </motion.div>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>

            {filteredRecipes.length === 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                <Typography align="center" sx={{ py: 16, fontSize: '3rem', color: '#aaa', fontStyle: 'italic', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                  {searchTerm ? 'No magic found...' : 'Your cookbook awaits its first spell! ✨'}
                </Typography>
              </motion.div>
            )}
          </Container>
        </Box>

        {/* Contact – Glowing */}
        <Container id="contact" sx={{ py: 16 }}>
          <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontWeight: 900, 
                mb: 8,
                background: 'linear-gradient(45deg, #ff006e, #3a86ff, #ffbe0b)', 
                backgroundClip: 'text', 
                WebkitBackgroundClip: 'text', 
                color: 'transparent',
                textShadow: '0 0 40px rgba(255,255,255,0.7)'
              }}
            >
              Get in Touch
            </Typography>
            <Typography align="center" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.3rem' }}>
              Have questions or recipe ideas? Reach out at{' '}
              <a 
                href="mailto:hello@flavorforge.app" 
                style={{ 
                  color: '#3a86ff', 
                  fontWeight: 'bold', 
                  textDecoration: 'none', 
                  cursor: 'pointer', 
                  textShadow: '0 0 10px rgba(58,134,255,0.5)' 
                }}
              >
                hello@flavorforge.app
              </a>
            </Typography>
          </motion.div>
        </Container>

        {/* Magical Floating Add Button */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          whileHover={{ scale: 1.3, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
        >
          <Fab 
            onClick={openAddRecipeModal}
            sx={{ 
              position: 'fixed', 
              bottom: 50, 
              right: 50, 
              width: 80, 
              height: 80,
              background: 'linear-gradient(45deg, #ff006e, #3a86ff)',
              boxShadow: '0 20px 50px rgba(58,134,255,0.8)',
            }}
          >
            <AddIcon sx={{ fontSize: 50 }} />
          </Fab>
        </motion.div>

        {/* View Modal – Epic Entrance */}
        <Modal open={!!viewRecipe} onClose={() => setViewRecipe(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <Paper sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: { xs: '95%', md: 1000 }, 
              maxHeight: '90vh', 
              overflow: 'auto',
              p: 6, 
              borderRadius: 6,
              bgcolor: 'rgba(255,255,255,0.98)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)'
            }}>
              <IconButton onClick={() => setViewRecipe(null)} sx={{ position: 'absolute', top: 20, right: 20 }}>
                <CloseIcon />
              </IconButton>
              {viewRecipe && (
                <>
                  <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #ff006e, #3a86ff, #ffbe0b)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                      {viewRecipe.name}
                    </Typography>
                  </motion.div>
                  {viewRecipe.image && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
                      <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <img src={viewRecipe.image} alt={viewRecipe.name} style={{ maxWidth: '100%', maxHeight: '600px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }} />
                      </Box>
                    </motion.div>
                  )}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <Typography variant="h4" gutterBottom sx={{ color: '#3a86ff' }}>Ingredients</Typography>
                    <Grid container spacing={2} sx={{ mb: 5 }}>
                      {viewRecipe.ingredients.split(',').map((ing, i) => (
                        <Grid item key={i}>
                          <motion.div whileHover={{ scale: 1.2 }}>
                            <Chip label={ing.trim()} color="primary" size="large" />
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                    <Typography variant="h4" gutterBottom sx={{ color: '#3a86ff' }}>Instructions</Typography>
                    <Box sx={{ pl: 3 }}>
                      {viewRecipe.instructions.split('\n').filter(Boolean).map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 + 1 }}
                        >
                          <Typography variant="body1" sx={{ my: 3, fontSize: '1.3rem' }}>
                            <strong style={{ color: '#ff006e', fontSize: '1.6rem' }}>{i + 1}.</strong> {step.trim()}
                          </Typography>
                        </motion.div>
                      ))}
                    </Box>
                  </motion.div>
                </>
              )}
            </Paper>
          </motion.div>
        </Modal>

        {/* Add/Edit Modal – Magical Entrance */}
        <Modal open={openForm} onClose={() => setOpenForm(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', bounce: 0.6 }}
          >
            <Paper sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: { xs: '95%', md: 800 }, 
              p: 6, 
              borderRadius: 6,
              bgcolor: 'rgba(255,255,255,0.98)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)'
            }}>
              <IconButton onClick={() => setOpenForm(false)} sx={{ position: 'absolute', top: 20, right: 20 }}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #ff006e, #3a86ff)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                {selectedRecipe ? 'Edit Magical Recipe' : 'Create New Masterpiece'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
                <TextField label="Recipe Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} margin="normal" required />
                <TextField label="Ingredients (comma separated)" fullWidth multiline rows={5} value={ingredients} onChange={(e) => setIngredients(e.target.value)} margin="normal" required />
                <TextField label="Instructions (one step per line)" fullWidth multiline rows={8} value={instructions} onChange={(e) => setInstructions(e.target.value)} margin="normal" required />
                <Button variant="outlined" component="label" fullWidth sx={{ mt: 4, py: 5, borderRadius: 4 }}>
                  {image ? 'Change Magical Photo' : 'Upload Delicious Photo'}
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {image && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                      <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }} />
                    </Box>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 6, 
                      py: 4, 
                      fontSize: '1.8rem',
                      borderRadius: 50,
                      background: 'linear-gradient(45deg, #ff006e, #3a86ff)',
                      boxShadow: '0 20px 50px rgba(58,134,255,0.7)',
                    }}
                  >
                    {selectedRecipe ? 'Update Magic' : 'Create Magic'}
                  </Button>
                </motion.div>
              </Box>
              {error && <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 4 }}>{success}</Alert>}
            </Paper>
          </motion.div>
        </Modal>
      </Box>
    </>
  );
}

export default App;